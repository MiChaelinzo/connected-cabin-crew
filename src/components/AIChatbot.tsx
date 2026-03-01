import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatCircleDots, 
  X, 
  PaperPlaneRight, 
  Microphone, 
  Stop,
  Paperclip,
  Image as ImageIcon,
  VideoCamera,
  FileText,
  Trash,
  SpinnerGap,
  BookOpen,
  FirstAid,
  Package,
  Users,
  Lightning,
  Airplane,
  ListChecks,
  IdentificationCard
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  url: string
  preview?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
  category: 'procedure' | 'passenger' | 'inventory' | 'emergency' | 'document'
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useKV<Message[]>('ai-chat-messages', [])
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    {
      id: 'emergency-procedure',
      label: 'Emergency Procedures',
      icon: <FirstAid className="w-4 h-4" weight="fill" />,
      prompt: 'Provide a quick reference guide for common in-flight emergency procedures, including medical emergencies, fire response, and evacuation protocols.',
      category: 'emergency'
    },
    {
      id: 'check-procedure',
      label: 'Safety Checklist',
      icon: <ListChecks className="w-4 h-4" weight="fill" />,
      prompt: 'Show me the pre-flight safety checklist for cabin crew, including all required safety equipment checks and cabin preparation steps.',
      category: 'procedure'
    },
    {
      id: 'passenger-assistance',
      label: 'Passenger Assistance',
      icon: <Users className="w-4 h-4" weight="fill" />,
      prompt: 'What are the best practices for assisting passengers with special needs, including mobility issues, medical conditions, and language barriers?',
      category: 'passenger'
    },
    {
      id: 'document-verification',
      label: 'Document Verification',
      icon: <IdentificationCard className="w-4 h-4" weight="fill" />,
      prompt: 'Guide me through verifying passenger travel documents, including passport checks, visa requirements, and boarding pass validation.',
      category: 'document'
    },
    {
      id: 'inventory-check',
      label: 'Inventory Guidelines',
      icon: <Package className="w-4 h-4" weight="fill" />,
      prompt: 'What are the procedures for inventory management during flight, including stock checking, consumption tracking, and reporting low supplies?',
      category: 'inventory'
    },
    {
      id: 'service-protocol',
      label: 'Service Protocols',
      icon: <Airplane className="w-4 h-4" weight="fill" />,
      prompt: 'Explain the standard service protocols for different flight phases, including meal service, beverage service, and duty-free sales procedures.',
      category: 'procedure'
    },
    {
      id: 'incident-reporting',
      label: 'Incident Reporting',
      icon: <FileText className="w-4 h-4" weight="fill" />,
      prompt: 'How do I properly document and report in-flight incidents? What information is required and what are the reporting procedures?',
      category: 'document'
    },
    {
      id: 'medical-assistance',
      label: 'Medical Response',
      icon: <FirstAid className="w-4 h-4" weight="fill" />,
      prompt: 'What are the steps for handling medical emergencies on board, including first aid procedures, using medical equipment, and when to request ground medical support?',
      category: 'emergency'
    }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!isOpen && messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && Date.now() - lastMessage.timestamp < 5000) {
        setHasNewMessage(true)
      }
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (messages && messages.length > 0) {
      setShowQuickActions(false)
    } else {
      setShowQuickActions(true)
    }
  }, [messages])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image' | 'video') => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newAttachments: Attachment[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`)
        continue
      }

      const reader = new FileReader()
      const attachment: Attachment = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        type,
        size: file.size,
        url: '',
      }

      reader.onload = (e) => {
        attachment.url = e.target?.result as string
        if (type === 'image') {
          attachment.preview = attachment.url
        }
      }

      reader.readAsDataURL(file)
      newAttachments.push(attachment)
    }

    setAttachments(prev => [...prev, ...newAttachments])
    toast.success(`${newAttachments.length} file(s) attached`)

    if (event.target) {
      event.target.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        
        reader.onload = () => {
          const attachment: Attachment = {
            id: `audio-${Date.now()}`,
            name: `voice-message-${Date.now()}.webm`,
            type: 'audio',
            size: audioBlob.size,
            url: reader.result as string,
          }
          setAttachments(prev => [...prev, attachment])
          toast.success('Voice message recorded')
        }
        
        reader.readAsDataURL(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.info('Recording voice message...')
    } catch (error) {
      toast.error('Could not access microphone')
      console.error('Microphone error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleQuickAction = async (action: QuickAction) => {
    setInput(action.prompt)
    toast.info(`Quick action: ${action.label}`)
    
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setMessages(current => [...(current || []), userMessage])
    setInput('')
    setAttachments([])
    setIsProcessing(true)

    try {
      let promptContent = input.trim()
      
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        const attachmentDescriptions = userMessage.attachments.map(a => {
          if (a.type === 'image') return `[Image: ${a.name}]`
          if (a.type === 'video') return `[Video: ${a.name}]`
          if (a.type === 'audio') return `[Voice Message: ${a.name}]`
          return `[Document: ${a.name}]`
        }).join(', ')
        
        promptContent = `${promptContent}\n\nAttachments: ${attachmentDescriptions}`
      }

      const prompt = window.spark.llmPrompt`You are an AI assistant specialized in cabin crew operations for airlines. You help with:
- Reading and analyzing documents (tickets, reports, safety logs, incident reports)
- Processing images (cabin photos, equipment issues, passenger documentation)
- Understanding videos (training materials, incident footage, cabin walkthroughs)
- Analyzing audio messages (crew voice notes, passenger complaints)
- Providing operational guidance (safety procedures, service protocols, inventory management)
- Answering questions about flight operations, passenger services, and crew coordination
- Helping with emergency procedures and medical assistance protocols

Be helpful, professional, and safety-conscious. Provide clear, actionable information that supports cabin crew operations.

User query: ${promptContent}

Provide a helpful, detailed response focused on cabin operations support.`

      const response = await window.spark.llm(prompt, 'gpt-4o')

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }

      setMessages(current => [...(current || []), assistantMessage])
      
      if (!isOpen) {
        setHasNewMessage(true)
        toast.success('AI Assistant responded', {
          description: 'Click the chat icon to view the response'
        })
      }
    } catch (error) {
      toast.error('Failed to get AI response')
      console.error('AI error:', error)
      
      const errorMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      }
      setMessages(current => [...(current || []), errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const clearChat = () => {
    setMessages(() => [])
    toast.success('Chat history cleared')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" weight="fill" />
      case 'video': return <VideoCamera className="w-4 h-4" weight="fill" />
      case 'audio': return <Microphone className="w-4 h-4" weight="fill" />
      default: return <FileText className="w-4 h-4" weight="fill" />
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'document')}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'video')}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[420px] h-[600px] flex flex-col"
          >
            <Card className="flex flex-col h-full shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-xl">
              <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ChatCircleDots className="w-6 h-6 text-primary" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Operations Assistant</h3>
                    <p className="text-xs text-muted-foreground">Cabin crew support powered by AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages && messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="h-8 w-8 p-0"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {(!messages || messages.length === 0) && (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                          <ChatCircleDots className="w-12 h-12 text-primary" weight="fill" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">AI Assistant Ready</h4>
                        <p className="text-sm text-muted-foreground max-w-xs mb-6">
                          I can help you with tickets, documents, images, videos, and cabin operations. Upload files or ask me anything!
                        </p>
                        
                        <div className="w-full space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightning className="w-4 h-4 text-accent" weight="fill" />
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Quick Actions</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {quickActions.map((action) => (
                              <motion.button
                                key={action.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction(action)}
                                className="flex flex-col items-start gap-2 p-3 bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border border-border rounded-lg transition-all duration-200 text-left group"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <div className="p-1.5 bg-primary/10 group-hover:bg-primary/20 rounded-md transition-colors">
                                    {action.icon}
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-foreground line-clamp-2">
                                  {action.label}
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {messages && messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] rounded-2xl px-4 py-3',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          )}
                        >
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="space-y-2 mb-3">
                              {message.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg',
                                    message.role === 'user' ? 'bg-primary-foreground/10' : 'bg-background/50'
                                  )}
                                >
                                  {attachment.preview && (
                                    <img
                                      src={attachment.preview}
                                      alt={attachment.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  {!attachment.preview && (
                                    <div className="w-12 h-12 flex items-center justify-center bg-background/30 rounded">
                                      {getAttachmentIcon(attachment.type)}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {message.content && (
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          )}
                          <p className={cn(
                            'text-xs mt-2 opacity-60',
                            message.role === 'user' ? 'text-right' : 'text-left'
                          )}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                          <div className="flex items-center gap-2">
                            <SpinnerGap className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t border-border bg-muted/30">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <Badge
                        key={attachment.id}
                        variant="secondary"
                        className="flex items-center gap-2 pr-1"
                      >
                        {getAttachmentIcon(attachment.type)}
                        <span className="text-xs max-w-[100px] truncate">{attachment.name}</span>
                        <button
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-0.5 hover:bg-destructive/20 rounded-sm transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border bg-background/50">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex-1"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1"
                  >
                    <VideoCamera className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Ask about cabin operations, upload files..."
                    className="min-h-[60px] resize-none"
                    disabled={isProcessing}
                  />
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={isRecording ? stopRecording : startRecording}
                      className="h-[28px] px-2"
                    >
                      {isRecording ? <Stop className="w-4 h-4" weight="fill" /> : <Microphone className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={sendMessage}
                      disabled={(!input.trim() && attachments.length === 0) || isProcessing}
                      size="sm"
                      className="h-[28px] px-2"
                    >
                      <PaperPlaneRight className="w-4 h-4" weight="fill" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setHasNewMessage(false)
          }
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-br from-primary to-accent hover:shadow-accent/50",
          "border-2 border-primary-foreground/20"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-primary-foreground" weight="bold" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <ChatCircleDots className="w-6 h-6 text-primary-foreground" weight="fill" />
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-primary-foreground"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
