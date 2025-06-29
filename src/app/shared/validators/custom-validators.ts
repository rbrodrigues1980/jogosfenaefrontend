import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Valida se a data de início é anterior à data de fim
   */
  static startBeforeEnd(startField: string, endField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startField)?.value;
      const end = group.get(endField)?.value;

      if (start && end && new Date(start) > new Date(end)) {
        return { startAfterEnd: { start, end } };
      }
      return null;
    };
  }

  /**
   * Valida se o range de datas é válido (data inicial <= data final)
   */
  static validDateRange(fromField: string, untilField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const from = group.get(fromField)?.value;
      const until = group.get(untilField)?.value;

      if (from && until && new Date(from) > new Date(until)) {
        return { invalidDateRange: { from, until } };
      }
      return null;
    };
  }

  /**
   * Valida se o número é positivo
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value !== undefined && value < 0) {
        return { positiveNumber: { value } };
      }
      return null;
    };
  }

  /**
   * Valida se a URL é válida
   */
  static validUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !this.isValidUrl(value)) {
        return { invalidUrl: { value } };
      }
      return null;
    };
  }

  /**
   * Valida se o email é válido
   */
  static validEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !this.isValidEmail(value)) {
        return { invalidEmail: { value } };
      }
      return null;
    };
  }

  private static isValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
