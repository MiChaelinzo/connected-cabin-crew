export type AlertSoundType = 'critical' | 'warning' | 'info' | 'success'

class AudioManager {
  private audioContext: AudioContext | null = null
  private isMuted = false

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine') {
    const ctx = this.initAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = type
    oscillator.frequency.value = frequency
    
    return { oscillator, gainNode, ctx }
  }

  playAlertSound(type: AlertSoundType) {
    if (this.isMuted) return

    switch (type) {
      case 'critical':
        this.playCriticalAlert()
        break
      case 'warning':
        this.playWarningAlert()
        break
      case 'info':
        this.playInfoAlert()
        break
      case 'success':
        this.playSuccessAlert()
        break
    }
  }

  private playCriticalAlert() {
    const { oscillator, gainNode, ctx } = this.createOscillator(800, 'square')
    const now = ctx.currentTime

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15)

    oscillator.start(now)
    oscillator.stop(now + 0.15)

    setTimeout(() => {
      const { oscillator: osc2, gainNode: gain2, ctx: ctx2 } = this.createOscillator(600, 'square')
      const now2 = ctx2.currentTime
      
      gain2.gain.setValueAtTime(0, now2)
      gain2.gain.linearRampToValueAtTime(0.3, now2 + 0.01)
      gain2.gain.linearRampToValueAtTime(0, now2 + 0.15)
      
      osc2.start(now2)
      osc2.stop(now2 + 0.15)
    }, 200)

    setTimeout(() => {
      const { oscillator: osc3, gainNode: gain3, ctx: ctx3 } = this.createOscillator(800, 'square')
      const now3 = ctx3.currentTime
      
      gain3.gain.setValueAtTime(0, now3)
      gain3.gain.linearRampToValueAtTime(0.3, now3 + 0.01)
      gain3.gain.linearRampToValueAtTime(0, now3 + 0.15)
      
      osc3.start(now3)
      osc3.stop(now3 + 0.15)
    }, 400)
  }

  private playWarningAlert() {
    const { oscillator, gainNode, ctx } = this.createOscillator(600, 'sine')
    const now = ctx.currentTime

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3)

    oscillator.frequency.setValueAtTime(600, now)
    oscillator.frequency.linearRampToValueAtTime(700, now + 0.15)

    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  private playInfoAlert() {
    const { oscillator, gainNode, ctx } = this.createOscillator(500, 'sine')
    const now = ctx.currentTime

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15)

    oscillator.start(now)
    oscillator.stop(now + 0.15)
  }

  private playSuccessAlert() {
    const { oscillator, gainNode, ctx } = this.createOscillator(700, 'sine')
    const now = ctx.currentTime

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1)

    oscillator.frequency.setValueAtTime(700, now)
    oscillator.frequency.linearRampToValueAtTime(900, now + 0.05)

    oscillator.start(now)
    oscillator.stop(now + 0.1)

    setTimeout(() => {
      const { oscillator: osc2, gainNode: gain2, ctx: ctx2 } = this.createOscillator(900, 'sine')
      const now2 = ctx2.currentTime
      
      gain2.gain.setValueAtTime(0, now2)
      gain2.gain.linearRampToValueAtTime(0.15, now2 + 0.02)
      gain2.gain.linearRampToValueAtTime(0, now2 + 0.1)
      
      osc2.start(now2)
      osc2.stop(now2 + 0.1)
    }, 100)
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
  }

  getMuted() {
    return this.isMuted
  }
}

export const audioManager = new AudioManager()
