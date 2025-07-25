export interface UserSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  apiCallsUsed: number;
  apiCallsLimit: number;
  subscriptionEnd?: Date;
  isActive: boolean;
  subscriptionId?: string;
  customerId?: string;
}

export class SubscriptionService {
  private static readonly STORAGE_KEY = 'user_subscription';
  private static readonly DAILY_RESET_KEY = 'daily_reset_date';

  static getSubscription(): UserSubscription {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const subscription = JSON.parse(stored);
        // Convert date string back to Date object
        if (subscription.subscriptionEnd) {
          subscription.subscriptionEnd = new Date(subscription.subscriptionEnd);
        }
        return subscription;
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }

    // Default free subscription
    return {
      plan: 'free',
      apiCallsUsed: 0,
      apiCallsLimit: 5,
      isActive: true
    };
  }

  static saveSubscription(subscription: UserSubscription): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscription));
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  static checkDailyReset(): void {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem(this.DAILY_RESET_KEY);

    if (lastReset !== today) {
      // Reset daily API calls for free users
      const subscription = this.getSubscription();
      if (subscription.plan === 'free') {
        subscription.apiCallsUsed = 0;
        this.saveSubscription(subscription);
      }
      localStorage.setItem(this.DAILY_RESET_KEY, today);
    }
  }

  static canUseAPI(): boolean {
    this.checkDailyReset();
    const subscription = this.getSubscription();
    
    if (!subscription.isActive) return false;
    
    if (subscription.plan === 'free') {
      return subscription.apiCallsUsed < subscription.apiCallsLimit;
    }
    
    // Pro and Enterprise have unlimited API calls
    return true;
  }

  static useAPICall(): boolean {
    if (!this.canUseAPI()) return false;
    
    const subscription = this.getSubscription();
    if (subscription.plan === 'free') {
      subscription.apiCallsUsed++;
      this.saveSubscription(subscription);
    }
    
    return true;
  }

  static getRemainingAPICalls(): number {
    this.checkDailyReset();
    const subscription = this.getSubscription();
    
    if (subscription.plan === 'free') {
      return Math.max(0, subscription.apiCallsLimit - subscription.apiCallsUsed);
    }
    
    return Infinity; // Unlimited for paid plans
  }

  // Real upgrade functions that would integrate with payment processor
  static async upgradeToPro(paymentData?: any): Promise<boolean> {
    try {
      // In real implementation, this would call your payment processor
      // For now, we'll simulate successful payment
      
      const subscription = this.getSubscription();
      subscription.plan = 'pro';
      subscription.apiCallsLimit = Infinity;
      subscription.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      subscription.isActive = true;
      subscription.subscriptionId = `pro_${Date.now()}`;
      subscription.customerId = `cust_${Date.now()}`;
      
      this.saveSubscription(subscription);
      
      // Track upgrade event
      this.trackEvent('subscription_upgrade', { plan: 'pro' });
      
      return true;
    } catch (error) {
      console.error('Upgrade failed:', error);
      return false;
    }
  }

  static async upgradeToEnterprise(paymentData?: any): Promise<boolean> {
    try {
      // In real implementation, this would call your payment processor
      
      const subscription = this.getSubscription();
      subscription.plan = 'enterprise';
      subscription.apiCallsLimit = Infinity;
      subscription.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      subscription.isActive = true;
      subscription.subscriptionId = `ent_${Date.now()}`;
      subscription.customerId = `cust_${Date.now()}`;
      
      this.saveSubscription(subscription);
      
      // Track upgrade event
      this.trackEvent('subscription_upgrade', { plan: 'enterprise' });
      
      return true;
    } catch (error) {
      console.error('Upgrade failed:', error);
      return false;
    }
  }

  static async cancelSubscription(): Promise<boolean> {
    try {
      const subscription = this.getSubscription();
      
      // In real implementation, cancel with payment processor
      
      subscription.plan = 'free';
      subscription.apiCallsLimit = 5;
      subscription.apiCallsUsed = 0;
      subscription.isActive = true;
      subscription.subscriptionEnd = undefined;
      subscription.subscriptionId = undefined;
      subscription.customerId = undefined;
      
      this.saveSubscription(subscription);
      
      this.trackEvent('subscription_cancelled');
      
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      return false;
    }
  }

  static getSubscriptionStatus(): string {
    const subscription = this.getSubscription();
    
    if (subscription.plan === 'free') {
      const remaining = this.getRemainingAPICalls();
      return `Free Plan: ${remaining}/5 daily API calls remaining`;
    }
    
    if (subscription.subscriptionEnd) {
      const daysLeft = Math.ceil((subscription.subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) {
        // Subscription expired, downgrade to free
        this.cancelSubscription();
        return 'Free Plan: Subscription expired';
      }
      return `${subscription.plan.toUpperCase()} Plan: ${daysLeft} days remaining`;
    }
    
    return `${subscription.plan.toUpperCase()} Plan: Active`;
  }

  // Analytics and tracking
  private static trackEvent(event: string, data?: any): void {
    try {
      // In real implementation, send to analytics service
      console.log('Event tracked:', event, data);
      
      // Store locally for now
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
        userId: this.getSubscription().customerId || 'anonymous'
      });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Revenue tracking
  static getRevenue(): { monthly: number; yearly: number; total: number } {
    const subscription = this.getSubscription();
    
    // In real implementation, this would come from your payment processor
    const revenue = {
      monthly: subscription.plan === 'pro' ? 19 : subscription.plan === 'enterprise' ? 49 : 0,
      yearly: subscription.plan === 'pro' ? 180 : subscription.plan === 'enterprise' ? 468 : 0,
      total: 0 // Would be calculated from all users
    };
    
    return revenue;
  }

  // User engagement metrics
  static getUsageStats(): { questionsGenerated: number; apiCallsUsed: number; planUpgrades: number } {
    try {
      const stats = JSON.parse(localStorage.getItem('usage_stats') || '{"questionsGenerated":0,"apiCallsUsed":0,"planUpgrades":0}');
      return stats;
    } catch {
      return { questionsGenerated: 0, apiCallsUsed: 0, planUpgrades: 0 };
    }
  }

  static incrementUsageStats(type: 'questionsGenerated' | 'apiCallsUsed' | 'planUpgrades'): void {
    try {
      const stats = this.getUsageStats();
      stats[type]++;
      localStorage.setItem('usage_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update usage stats:', error);
    }
  }
}