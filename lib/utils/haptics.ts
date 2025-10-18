import {
  vibrate,
  impactFeedback,
  notificationFeedback,
  selectionFeedback,
} from "@tauri-apps/plugin-haptics";

/**
 * Haptic feedback utility for consistent haptic responses across the app
 */
export class HapticFeedback {
  private static isEnabled = true;

  /**
   * Enable or disable haptic feedback globally
   */
  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Check if haptic feedback is enabled
   */
  static getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Light haptic feedback for selections and navigation
   * Use for: navigation taps, filter selections, toggle switches
   */
  static async selection(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await selectionFeedback();
    } catch (error) {
      console.log("Selection haptic feedback not available:", error);
    }
  }

  /**
   * Light impact feedback for UI interactions
   * Use for: button taps, menu selections
   */
  static async light(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await impactFeedback("light");
    } catch (error) {
      console.log("Light haptic feedback not available:", error);
    }
  }

  /**
   * Medium impact feedback for important actions
   * Use for: save/favorite actions, form submissions
   */
  static async medium(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await impactFeedback("medium");
    } catch (error) {
      console.log("Medium haptic feedback not available:", error);
    }
  }

  /**
   * Heavy impact feedback for significant actions
   * Use for: delete actions, important confirmations
   */
  static async heavy(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await impactFeedback("heavy");
    } catch (error) {
      console.log("Heavy haptic feedback not available:", error);
    }
  }

  /**
   * Success notification feedback
   * Use for: successful saves, completed actions
   */
  static async success(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await notificationFeedback("success");
    } catch (error) {
      console.log("Success haptic feedback not available:", error);
    }
  }

  /**
   * Warning notification feedback
   * Use for: validation errors, warnings
   */
  static async warning(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await notificationFeedback("warning");
    } catch (error) {
      console.log("Warning haptic feedback not available:", error);
    }
  }

  /**
   * Error notification feedback
   * Use for: errors, failed actions
   */
  static async error(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await notificationFeedback("error");
    } catch (error) {
      console.log("Error haptic feedback not available:", error);
    }
  }

  /**
   * Custom vibration pattern
   * Use for: special interactions, custom feedback
   */
  static async vibrate(duration: number = 200): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await vibrate(duration);
    } catch (error) {
      console.log("Vibration haptic feedback not available:", error);
    }
  }

  /**
   * Button press feedback - convenience method for button interactions
   * Use for: most button presses and clickable elements
   */
  static async buttonPress(): Promise<void> {
    return this.light();
  }

  /**
   * Card tap feedback - convenience method for card interactions
   * Use for: restaurant cards, list items
   */
  static async cardTap(): Promise<void> {
    return this.selection();
  }

  /**
   * Toggle feedback - convenience method for toggle actions
   * Use for: favorite/unfavorite, like/unlike
   */
  static async toggle(): Promise<void> {
    return this.medium();
  }

  /**
   * Navigation feedback - convenience method for navigation actions
   * Use for: tab switches, page navigation
   */
  static async navigation(): Promise<void> {
    return this.selection();
  }
}

/**
 * Convenience functions for common haptic patterns
 */
export const haptics = {
  // Basic interactions
  selection: () => HapticFeedback.selection(),
  light: () => HapticFeedback.light(),
  medium: () => HapticFeedback.medium(),
  heavy: () => HapticFeedback.heavy(),

  // Notifications
  success: () => HapticFeedback.success(),
  warning: () => HapticFeedback.warning(),
  error: () => HapticFeedback.error(),

  // Custom
  vibrate: (duration?: number) => HapticFeedback.vibrate(duration),

  // Convenience methods
  buttonPress: () => HapticFeedback.buttonPress(),
  cardTap: () => HapticFeedback.cardTap(),
  toggle: () => HapticFeedback.toggle(),
  navigation: () => HapticFeedback.navigation(),
};

export default haptics;
