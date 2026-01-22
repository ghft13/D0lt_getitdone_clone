/**
 * Frontend Fee Calculator
 * Matches backend fee calculation logic
 */

export const DOLT_FEE_PERCENTAGE = 2.05; // 2.05%
export const MARKETPLACE_CHARGE_PERCENTAGE = 5.0; // 5%

export interface FeeBreakdown {
    baseAmount: number;
    doltFee: number;
    doltFeePercentage: number;
    marketplaceCharge: number;
    marketplaceChargePercentage: number;
    totalFees: number;
    finalAmount: number;
}

/**
 * Calculate fees for a given base amount
 * @param baseAmount - The original price before fees
 * @returns Fee breakdown with all amounts
 */
export function calculateFees(baseAmount: number): FeeBreakdown {
    const base = parseFloat(baseAmount.toString()) || 0;

    if (base < 0) {
        throw new Error('Base amount cannot be negative');
    }

    // Calculate individual fees
    const doltFee = (base * DOLT_FEE_PERCENTAGE) / 100;
    const marketplaceCharge = (base * MARKETPLACE_CHARGE_PERCENTAGE) / 100;
    const totalFees = doltFee + marketplaceCharge;
    const finalAmount = base + totalFees;

    // Round to 2 decimal places for currency
    return {
        baseAmount: parseFloat(base.toFixed(2)),
        doltFee: parseFloat(doltFee.toFixed(2)),
        doltFeePercentage: DOLT_FEE_PERCENTAGE,
        marketplaceCharge: parseFloat(marketplaceCharge.toFixed(2)),
        marketplaceChargePercentage: MARKETPLACE_CHARGE_PERCENTAGE,
        totalFees: parseFloat(totalFees.toFixed(2)),
        finalAmount: parseFloat(finalAmount.toFixed(2))
    };
}

/**
 * Format currency with proper decimals
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return `$${amount.toFixed(2)} ${currency}`;
}
