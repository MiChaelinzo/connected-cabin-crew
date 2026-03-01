import type { CabinAlert, AlertPriority, AlertCategory } from '@/lib/types'

export function createAlert(
  category: AlertCategory,
  priority: AlertPriority,
  title: string,
  message: string,
  location?: string,
  actionRequired?: string
): CabinAlert {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category,
    priority,
    title,
    message,
    location,
    timestamp: Date.now(),
    acknowledged: false,
    resolved: false,
    actionRequired,
  }
}

export const sampleAlerts = {
  criticalMedical: () => createAlert(
    'medical',
    'critical',
    'Medical Emergency',
    'Passenger experiencing chest pain and difficulty breathing. Immediate medical attention required.',
    'Seat 23A - Economy',
    'Administer oxygen and assess vital signs. Prepare for possible diversion.'
  ),
  
  criticalSafety: () => createAlert(
    'safety',
    'critical',
    'Smoke Detected',
    'Smoke alarm triggered in rear lavatory. Potential fire hazard detected.',
    'Rear Lavatory (AFT)',
    'Investigate immediately with fire extinguisher. Notify flight deck.'
  ),
  
  highEquipment: () => createAlert(
    'equipment',
    'high',
    'Equipment Malfunction',
    'Galley oven #2 non-functional. Unable to heat meal service items.',
    'Galley 3',
    'Adjust meal service plan and notify catering for next leg.'
  ),
  
  highPassenger: () => createAlert(
    'passenger',
    'high',
    'Disruptive Passenger',
    'Passenger refusing to comply with crew instructions regarding seatbelt.',
    'Seat 17C - Business',
    'Issue verbal warning. Document incident. Notify senior crew member.'
  ),
  
  mediumService: () => createAlert(
    'service',
    'medium',
    'Special Meal Missing',
    'Vegetarian meal not loaded for passenger with confirmed special request.',
    'Seat 8B - Business',
    'Offer alternative options and apologize for inconvenience.'
  ),
  
  mediumEquipment: () => createAlert(
    'equipment',
    'medium',
    'IFE System Error',
    'In-flight entertainment system offline for rows 15-20.',
    'Zone B - Rows 15-20',
    'Reset system. Offer compensation if issue persists.'
  ),
  
  lowService: () => createAlert(
    'service',
    'low',
    'Low Beverage Stock',
    'Tomato juice running low. Only 3 cans remaining for 2-hour flight segment.',
    'Forward Galley'
  ),
  
  mediumPassenger: () => createAlert(
    'passenger',
    'medium',
    'Tight Connection Alert',
    'Passenger has 35-minute connection in LHR. Gate assignment not yet available.',
    'Seat 12A - Business',
    'Monitor gate information and assist with priority deplaning if possible.'
  ),
}
