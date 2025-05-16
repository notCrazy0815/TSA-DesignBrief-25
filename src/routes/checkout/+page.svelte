<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { basket, basketSubtotal, type BasketItem } from "$lib/stores/basketStore";
    import Footer from "$lib/components/Footer.svelte";
    import { formatPrice } from "$lib/utils/formatPrice";

    let checkoutItems: BasketItem[] = [];
    let subtotal = 0;
    let tax = 0;
    let tipAmount = 0;
    let totalWithTax = 0;
    let grandTotal = 0;

    let selectedTipPercentage: number = 0;
    let customTipInput: string = "";
    let orderNotes: string = "";

    let availablePickupSlots: string[] = [];
    let selectedSlotIndex: number = 0;
    let selectedPickupSlot: string | null = null;
    let isModalOpen = false;
    let orderNumber = '';

    const openingTime = { hours: 9, minutes: 0 };
    const closingTime = { hours: 21, minutes: 0 };
    const minPrepTimeMinutes = 20;
    const slotIntervalMinutes = 15;
    const orderCutoffMinutesBeforeClosing = 30;

    const tipPercentages = [10, 15, 20];

    const unsubscribeBasket = basket.subscribe(items => {
        checkoutItems = items;
        calculateAllTotals();
    });

    const unsubscribeSubtotal = basketSubtotal.subscribe(value => {
        subtotal = value;
        calculateAllTotals();
    });

    onMount(() => {
        generatePickupSlots();
        return () => {
            unsubscribeBasket();
            unsubscribeSubtotal();
        };
    });

    $: {
        if (availablePickupSlots.length > 0 && selectedSlotIndex >= 0 && selectedSlotIndex < availablePickupSlots.length) {
            selectedPickupSlot = availablePickupSlots[selectedSlotIndex];
        } else if (availablePickupSlots.length === 0) {
            selectedPickupSlot = null; 
        }
        else if (availablePickupSlots.length > 0) {
            selectedSlotIndex = 0;
            selectedPickupSlot = availablePickupSlots[0];
        }
    }

    function formatSlotTime(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    }

    function generatePickupSlots() {
        const slots: string[] = [];
        const now = new Date();
        
        const earliestPickupTime = new Date(now.getTime() + minPrepTimeMinutes * 60000);


        const minutes = earliestPickupTime.getMinutes();
        const roundedMinutes = Math.ceil(minutes / slotIntervalMinutes) * slotIntervalMinutes;
        earliestPickupTime.setMinutes(roundedMinutes);
        earliestPickupTime.setSeconds(0);
        earliestPickupTime.setMilliseconds(0);

        const storeClosingTime = new Date(now);
        storeClosingTime.setHours(closingTime.hours, closingTime.minutes, 0, 0);
        
        const orderCutoffTime = new Date(storeClosingTime.getTime() - orderCutoffMinutesBeforeClosing * 60000);

        let currentSlotTime = new Date(earliestPickupTime);

        while (currentSlotTime <= orderCutoffTime) {
            const slotDate = new Date(now);
            slotDate.setHours(currentSlotTime.getHours(), currentSlotTime.getMinutes(), 0, 0);
            
            const storeOpeningTimeToday = new Date(now);
            storeOpeningTimeToday.setHours(openingTime.hours, openingTime.minutes, 0, 0);

            if (slotDate >= storeOpeningTimeToday && slotDate <= storeClosingTime) {
                if (slotDate > now && slotDate.getTime() > earliestPickupTime.getTime() - (slotIntervalMinutes * 60000)) {
                    slots.push(formatSlotTime(slotDate));
                } else if (slotDate > now && earliestPickupTime < storeOpeningTimeToday && slotDate >= storeOpeningTimeToday) {
                    slots.push(formatSlotTime(slotDate));
                }
            }
            currentSlotTime.setMinutes(currentSlotTime.getMinutes() + slotIntervalMinutes);
        }
        availablePickupSlots = slots;
        if (availablePickupSlots.length > 0) {
            selectedSlotIndex = 0;
            selectedPickupSlot = availablePickupSlots[0];
        } else {
            selectedPickupSlot = null;
        }
    }

    function calculateAllTotals() {
        tax = subtotal * 0.08; // 8% tax rate
        totalWithTax = subtotal + tax;
        grandTotal = totalWithTax + tipAmount;
    }

    function selectTipPercentage(percentage: number) {
        selectedTipPercentage = percentage;
        tipAmount = subtotal * (percentage / 100);
        customTipInput = ""; // Clear custom tip if percentage is selected
        calculateAllTotals();
    }

    function handleCustomTipInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const value = parseFloat(inputElement.value);
        if (!isNaN(value) && value >= 0) {
            tipAmount = value;
            selectedTipPercentage = 0; // Clear percentage tip if custom is entered
        } else if (inputElement.value === "") {
            tipAmount = 0;
            selectedTipPercentage = 0;
        }
        customTipInput = inputElement.value; // Keep input string for display
        calculateAllTotals();
    }
    
    function clearTip() {
        tipAmount = 0;
        selectedTipPercentage = 0;
        customTipInput = "";
        calculateAllTotals();
    }

    function updateQuantity(id: number, newQuantity: number) {
        if (newQuantity < 1) return;
        basket.updateItemQuantity(id, newQuantity);
    }

    function removeItem(id: number) {
        basket.removeItem(id);
    }

    function openCheckoutModal() {
        if (checkoutItems.length === 0) {
            alert("Your bag is empty.");
            return;
        }
        if (!selectedPickupSlot && availablePickupSlots.length > 0) {
            alert("Please select a pickup time.");
            return;
        }

        // Generate a random order number
        orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString();
        isModalOpen = true;
    }

    function finalizeOrder() {
        const orderDetails = {
            items: checkoutItems.map(item => ({ 
                id: item.id, 
                name: item.name, 
                quantity: item.quantity, 
                price: item.price 
            })),
            subtotal,
            tax,
            tipAmount,
            grandTotal,
            orderNotes,
            pickupTime: selectedPickupSlot,
            orderNumber
        };

        console.log("Order Details:", orderDetails);
        
        basket.clearBasket();
        isModalOpen = false;
    }

    function closeModal() {
        isModalOpen = false;
    }
</script>

<div class="checkout-background">
<div class="page-container checkout-container">
    <h1>Checkout</h1>
    
    {#if checkoutItems.length === 0}
        <div class="empty-bag-section">
            <p>Your bag is empty. Add items from the menu to proceed.</p>
            <button class="action-btn primary-action" on:click={() => goto('/menu')}>Browse Menu</button>
        </div>
    {:else}
        <div class="order-sections">
            <div class="order-details-section content-card">
                <h2>Order Details</h2>
                <div class="checkout-items-list">
                    <h3 class="list-header">Items</h3>
                    {#each checkoutItems as item}
                        <div class="checkout-item">
                            <div class="item-info">
                                <span class="item-name">{item.name}</span>
                                <span class="item-quantity-details">(x{item.quantity} at {formatPrice(item.price)} each)</span>
                            </div>
                            <div class="item-controls">
                                <button class="quantity-btn icon-btn" on:click={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                                <button class="quantity-btn icon-btn" on:click={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                                <button class="remove-btn-small icon-btn danger-icon-btn" on:click={() => removeItem(item.id)} aria-label="Remove item">×</button>
                            </div>
                            <div class="item-total-line">
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    {/each}
                </div>
                 <div class="form-group">
                    <label for="orderNotes">Special Requests / Notes</label>
                    <textarea id="orderNotes" bind:value={orderNotes} placeholder="e.g., allergy information, no onions, extra sauce..."></textarea>
                </div>
            </div>

            <div class="summary-payment-section content-card">
                <h2>Summary & Payment</h2>
                <div class="checkout-summary-box">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (8%)</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    
                    <div class="tip-section form-group">
                        <label for="customTipInput">Add a Tip</label>
                        <div class="tip-options">
                            {#each tipPercentages as percentage}
                                <button 
                                    class="choice-btn {selectedTipPercentage === percentage ? 'active' : ''}" 
                                    on:click={() => selectTipPercentage(percentage)}>{percentage}%</button>
                            {/each}
                            <input 
                                type="number" 
                                id="customTipInput"
                                class="custom-tip-input" 
                                bind:value={customTipInput} 
                                on:input={handleCustomTipInput} 
                                placeholder="Custom $"
                            />
                            {#if tipAmount > 0}
                                <button class="clear-tip-btn text-btn" on:click={clearTip}>Clear Tip</button>
                            {/if}
                        </div>
                        {#if tipAmount > 0}
                        <div class="summary-row tip-display">
                            <span>Tip Applied</span>
                            <span>{formatPrice(tipAmount)}</span>
                        </div>
                        {/if}
                    </div>

                    <div class="pickup-time-section form-group">
                        <label for="pickupTimeSlider">
                            Select Pickup Time: 
                            <strong class="selected-slot-value">
                                {selectedPickupSlot || (availablePickupSlots.length > 0 ? 'Drag to select' : 'N/A')}
                            </strong>
                        </label>
                        {#if availablePickupSlots.length > 0}
                            <input 
                                type="range" 
                                id="pickupTimeSlider"
                                min="0"
                                max={availablePickupSlots.length - 1}
                                step="1"
                                bind:value={selectedSlotIndex}
                                class="pickup-time-slider"
                                aria-label="Pickup time slider"
                            />
                            {#if availablePickupSlots.length > 1}
                            <div class="slider-labels">
                                <span>{availablePickupSlots[0]}</span>
                                <span>{availablePickupSlots[availablePickupSlots.length - 1]}</span>
                            </div>
                            {/if}
                        {:else}
                            <p class="no-slots-message">Sorry, no pickup slots are currently available. Please check back later or contact us.</p>
                        {/if}
                    </div>

                    <div class="summary-row estimated-pickup">
                        <span>Estimated Pickup</span>
                        <span>15-20 mins</span>
                    </div>

                    <div class="summary-row grand-total">
                        <span>Grand Total</span>
                        <span>{formatPrice(grandTotal)}</span>
                    </div>
                </div>

                <div class="payment-method-section form-group">
                    <p id="paymentMethodsLabel" class="payment-methods-label">Accepted Payment Methods (at counter):</p>
                    <div class="accepted-payment-methods-display" aria-labelledby="paymentMethodsLabel">
                        <span class="payment-method-tag">Credit/Debit Card</span>
                        <span class="payment-method-tag">Cash</span>
                        <span class="payment-method-tag">Apple Pay</span>
                        <span class="payment-method-tag">Google Pay</span>
                        <span class="payment-method-tag">PayPal</span>
                    </div>
                </div>
                
                <button class="action-btn primary-action finalize-btn" on:click={openCheckoutModal}>Finalize & Place Order</button>
                <p class="finalize-info">You'll receive an order number upon completion.</p>
                <button class="action-btn secondary-action" on:click={() => goto('/menu')}>Back to Menu</button>
            </div>
        </div>
    {/if}
</div>

<Footer />
</div>

{#if isModalOpen}
<div class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Confirm Your Order</h2>
            <button class="modal-close-btn" on:click={closeModal}>&times;</button>
        </div>
        <div class="modal-body">
            <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-items">
                    {#each checkoutItems as item}
                        <div class="summary-item">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    {/each}
                </div>
                <div class="summary-totals">
                    <div class="summary-total-row">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div class="summary-total-row">
                        <span>Tax (8%):</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    {#if tipAmount > 0}
                    <div class="summary-total-row">
                        <span>Tip:</span>
                        <span>{formatPrice(tipAmount)}</span>
                    </div>
                    {/if}
                    <div class="summary-total-row grand-total">
                        <span>Total:</span>
                        <span>{formatPrice(grandTotal)}</span>
                    </div>
                </div>
                <div class="pickup-info">
                    <p><strong>Pickup Time:</strong> {selectedPickupSlot}</p>
                    {#if orderNotes}
                        <p><strong>Notes:</strong> {orderNotes}</p>
                    {/if}
                </div>
            </div>
            <div class="payment-notice">
                <p>Payment will be collected at the counter when you pick up your order.</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="modal-btn secondary" on:click={closeModal}>Cancel</button>
            <button class="modal-btn primary" on:click={finalizeOrder}>Confirm Order</button>
        </div>
    </div>
</div>
{/if}

{#if orderNumber && !isModalOpen}
<div class="modal-overlay">
    <div class="modal-content success-modal">
        <div class="modal-header">
            <h2>Order Confirmed!</h2>
        </div>
        <div class="modal-body">
            <div class="success-icon">✓</div>
            <h3>Thank You For Your Order</h3>
            <p>Your order will be ready for pickup at {selectedPickupSlot}.</p>
            <div class="order-number">
                <span>ORDER NUMBER</span>
                <h2>{orderNumber}</h2>
            </div>
            <p class="success-note">Please provide this order number when you arrive to collect your order.</p>
        </div>
        <div class="modal-footer">
            <button class="modal-btn primary" on:click={() => goto('/')}>Return to Home</button>
        </div>
    </div>
</div>
{/if}

<style lang="scss">
    @use "../../lib/styles/variables" as v;

    .checkout-background {
        
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 0;
        
    }

    * {
        box-sizing: border-box;
    }
    
    .page-container {
        width: 100%;
        max-width: 1100px;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        font-family: 'Inter', sans-serif;
        color: v.$font-color-dark;
        position: relative; 
        z-index: 10;
        flex: 1;
        background-color: v.$background-color-light;

        @media (min-width: 600px) {
            margin-top: 2rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
        }

        @media (min-width: 800px) {
             margin-top: 3rem;
             margin-bottom: 3rem;
             padding: 2rem;
        }
    }

    h1, h2, h3 {
        font-family: 'DynaPuff Regular', cursive;
    }

    h1 {
        font-size: 2.8rem;
        margin-bottom: 2.5rem;
        color: v.$tertiary-dark;
        text-align: center;
    }

    h2 {
        font-size: 2rem;
        color: v.$tertiary;
        margin-bottom: 2rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid rgba(v.$primary, 0.5);
    }

    h3.list-header {
        font-size: 1.4rem;
        color: v.$font-color-dark;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }

    .content-card {
        background-color: #FFFFFF;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(v.$font-color-dark, 0.08);
        border: 1px solid rgba(v.$font-color-dark, 0.1);
    }

    .order-sections {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;

        @media (min-width: 800px) {
            grid-template-columns: 1.6fr 1fr;
        }
    }

    .form-group {
        margin-bottom: 1.75rem;
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.6rem;
            font-size: 1rem;
            color: v.$font-color-dark;
        }
        input[type="number"],
        textarea {
            width: 100%;
            padding: 0.85rem 1rem;
            border: 1px solid rgba(v.$font-color-dark, 0.25);
            border-radius: 8px;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
            background-color: rgba(v.$primary, 0.02);
            transition: border-color 0.2s, box-shadow 0.2s;

            &:focus {
                outline: none;
                border-color: v.$primary;
                box-shadow: 0 0 0 3px rgba(v.$primary, 0.2);
            }
            &::placeholder {
                color: rgba(v.$font-color-dark, 0.5);
            }
        }
        textarea {
            min-height: 100px;
            resize: vertical;
        }
    }

    .checkout-items-list {
        margin-bottom: 2rem;
    }

    .checkout-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        padding: 1.25rem 0;
        border-bottom: 1px solid rgba(v.$font-color-dark, 0.1);
        gap: 1rem;
        &:last-child {
            border-bottom: none;
        }

        .item-info {
            display: flex;
            flex-direction: column;
            .item-name {
                font-weight: 600;
                font-size: 1.05rem;
                color: v.$font-color-dark;
            }
            .item-quantity-details {
                font-size: 0.85rem;
                color: rgba(v.$font-color-dark, 0.7);
            }
        }
        .item-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .icon-btn {
            background: none;
            border: 1px solid rgba(v.$font-color-dark, 0.3);
            color: v.$font-color-dark;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, border-color 0.2s, color 0.2s;
            line-height: 1; 

            &:hover {
                background-color: rgba(v.$font-color-dark, 0.05);
                border-color: rgba(v.$font-color-dark, 0.5);
            }
        }
        .danger-icon-btn {
            border-color: rgba(v.$primary, 0.4);
            color: v.$primary;
            &:hover {
                background-color: rgba(v.$primary, 0.1);
                border-color: v.$primary;
                color: v.$primary;
            }
        }
        .item-total-line {
            font-weight: 700;
            text-align: right;
            font-size: 1.05rem;
            color: v.$tertiary-dark;
        }
    }

    .checkout-summary-box {
        background-color: rgba(v.$primary, 0.03);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid rgba(v.$primary, 0.1);

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-size: 1rem;
            padding: 0.25rem 0;
            span:first-child {
                color: rgba(v.$font-color-dark, 0.8);
            }
            span:last-child {
                font-weight: 600;
                color: v.$font-color-dark;
            }
            &.grand-total {
                font-weight: bold;
                font-size: 1.4rem;
                color: v.$tertiary-dark;
                padding-top: 1.25rem;
                margin-top: 1rem;
                border-top: 2px solid rgba(v.$primary, 0.5);
            }
        }
    }
    
    .tip-section, .payment-method-section, .pickup-time-section {
        margin-bottom: 2rem;
        label, .payment-methods-label {
            font-weight: 600;
            margin-bottom: 1rem; 
            font-size: 1.1rem;
            display: block;
        }
    }
    
    .selected-slot-value {
        color: v.$primary;
        font-weight: 700;
        margin-left: 0.5rem;
    }

    .tip-section {
        .tip-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            align-items: center;
        }
    }

    .pickup-time-slider {
        width: 100%;
        height: 10px;
        background: rgba(v.$font-color-dark, 0.1);
        border-radius: 5px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            background: v.$primary;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 1px 3px rgba(v.$font-color-dark, 0.3);
            margin-top: -6px;
        }

        &::-moz-range-thumb {
            width: 22px;
            height: 22px;
            background: v.$primary;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 1px 3px rgba(v.$font-color-dark, 0.3);
        }
         &::-ms-thumb {
            width: 22px;
            height: 22px;
            background: v.$primary;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 1px 3px rgba(v.$font-color-dark, 0.3);
        }

        &::-webkit-slider-runnable-track {
            height: 10px;
            background: rgba(v.$font-color-dark, 0.1);
            border-radius: 5px;
        }
        &::-moz-range-track {
            height: 10px;
            background: rgba(v.$font-color-dark, 0.1);
            border-radius: 5px;
        }
         &::-ms-track {
            height: 10px;
            background: rgba(v.$font-color-dark, 0.1);
            border-radius: 5px;
            color: transparent;
            border: none;
        }
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: rgba(v.$font-color-dark, 0.6);
        margin-top: 0.5rem;
        padding: 0 5px;
    }
    
    .no-slots-message {
        font-style: italic;
        color: rgba(v.$font-color-dark, 0.7);
        background-color: rgba(v.$font-color-dark, 0.03);
        padding: 1rem;
        border-radius: 8px;
        border: 1px dashed rgba(v.$font-color-dark, 0.2);
        text-align: center;
        margin-top: 0.5rem;
    }

    .choice-btn {
        padding: 0.75rem 1.25rem;
        border: 1px solid rgba(v.$font-color-dark, 0.3);
        border-radius: 8px;
        background-color: #FFFFFF;
        color: v.$font-color-dark;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
        font-size: 0.95rem;
        font-family: 'Inter', sans-serif;
        font-weight: 500;

        &:hover {
            border-color: v.$primary;
            background-color: rgba(v.$primary, 0.05);
            color: v.$primary;
        }
        &.active {
            background-color: v.$primary;
            color: v.$font-color-light;
            border-color: v.$primary;
            box-shadow: 0 2px 8px rgba(v.$primary, 0.3);
        }
    }

    .custom-tip-input {
        flex-grow: 1;
        max-width: 130px;
    }

    .text-btn {
        background: none;
        border: none;
        color: v.$primary;
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.5rem;
        font-family: 'Inter', sans-serif;
        &:hover {
            color: darken(v.$primary, 10%);
        }
    }

    .tip-display {
        margin-top: 1rem;
        color: v.$tertiary;
        font-size: 1rem;
        font-weight: 500;
    }

    .action-btn {
        width: 100%;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 1.15rem;
        font-family: 'DynaPuff Regular', cursive;
        cursor: pointer;
        transition: background-color 0.25s, transform 0.15s, box-shadow 0.25s;
        display: block;
        text-align: center;
        text-decoration: none;
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .primary-action {
        background-color: v.$tertiary-dark;
        color: v.$font-color-light;
        border: none;
        margin-bottom: 1rem; 
        box-shadow: 0 4px 12px rgba(darken(v.$tertiary-dark, 10%), 0.2);

        &:hover {
            background-color: darken(v.$tertiary-dark, 8%);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(darken(v.$tertiary-dark, 10%), 0.3);
        }
        &.finalize-btn {
             background-color: v.$primary;
             box-shadow: 0 4px 12px rgba(darken(v.$primary, 10%), 0.2);
             &:hover {
                background-color: darken(v.$primary, 8%);
                box-shadow: 0 6px 15px rgba(darken(v.$primary, 10%), 0.3);
             }
        }
    }
    
    .secondary-action {
        background-color: transparent;
        border: 2px solid rgba(v.$font-color-dark, 0.3);
        color: v.$font-color-dark;
        padding: calc(1rem - 2px) calc(1.5rem - 2px);

        &:hover {
            background-color: rgba(v.$font-color-dark, 0.05);
            border-color: rgba(v.$font-color-dark, 0.5);
            color: v.$font-color-dark;
            transform: translateY(-2px);
        }
    }

    .empty-bag-section {
        text-align: center;
        padding: 4rem 2rem;
        background-color: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(v.$font-color-dark, 0.08);
        border: 1px solid rgba(v.$font-color-dark, 0.1);
        p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            color: rgba(v.$font-color-dark, 0.7);
            font-family: 'Inter', sans-serif;
        }
        .primary-action {
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
            font-size: 1.1rem;
        }
    }

    .estimated-pickup {
        font-style: italic;
        font-size: 0.9rem !important;
        color: rgba(v.$font-color-dark, 0.7);
        span:last-child {
            font-weight: normal !important;
            color: rgba(v.$font-color-dark, 0.7) !important;
        }
    }

    .accepted-payment-methods-display {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
        margin-top: 0.75rem; 

        .payment-method-tag {
            background-color: rgba(v.$primary, 0.05);
            color: v.$primary;
            font-weight: 500;
            padding: 0.65rem 1.2rem;
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid rgba(v.$primary, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: default;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(v.$primary, 0.15);
            }
        }
    }

    .finalize-info {
        font-size: 0.85rem;
        color: rgba(v.$font-color-dark, 0.6);
        text-align: center;
        margin-top: -0.5rem;
        margin-bottom: 1.5rem;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
        padding: 1rem;
    }

    .modal-content {
        background-color: #FFFFFF;
        border-radius: 16px;
        width: 100%;
        max-width: 550px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        
        &.success-modal {
            max-width: 500px;
            text-align: center;
        }
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(v.$font-color-dark, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h2 {
            margin: 0;
            padding: 0;
            border: none;
            font-size: 1.8rem;
        }
    }

    .modal-close-btn {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: rgba(v.$font-color-dark, 0.6);
        line-height: 1;
        
        &:hover {
            color: v.$font-color-dark;
        }
    }

    .modal-body {
        padding: 1.5rem;
        flex-grow: 1;
    }

    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(v.$font-color-dark, 0.1);
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .modal-btn {
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        
        &.primary {
            background-color: v.$primary;
            color: v.$font-color-light;
            border: none;
            
            &:hover {
                background-color: darken(v.$primary, 8%);
                transform: translateY(-2px);
            }
        }
        
        &.secondary {
            background-color: transparent;
            border: 1px solid rgba(v.$font-color-dark, 0.3);
            color: v.$font-color-dark;
            
            &:hover {
                background-color: rgba(v.$font-color-dark, 0.05);
                border-color: rgba(v.$font-color-dark, 0.5);
            }
        }
    }

    .order-summary {
        margin-bottom: 1.5rem;
        
        h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
        }
    }

    .summary-items {
        margin-bottom: 1.5rem;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(v.$font-color-dark, 0.1);
        
        &:last-child {
            border-bottom: none;
        }
    }

    .summary-totals {
        background-color: rgba(v.$primary, 0.03);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .summary-total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        &.grand-total {
            font-weight: 700;
            font-size: 1.2rem;
            color: v.$tertiary-dark;
            padding-top: 0.5rem;
            margin-top: 0.5rem;
            border-top: 1px solid rgba(v.$primary, 0.3);
        }
    }

    .pickup-info {
        margin-top: 1.5rem;
        
        p {
            margin: 0.5rem 0;
        }
    }

    .payment-notice {
        background-color: rgba(v.$font-color-dark, 0.03);
        padding: 1rem;
        border-radius: 8px;
        border: 1px dashed rgba(v.$font-color-dark, 0.2);
        margin-top: 1.5rem;
        
        p {
            margin: 0;
            font-style: italic;
            color: rgba(v.$font-color-dark, 0.7);
        }
    }

    .success-icon {
        font-size: 3.5rem;
        color: v.$primary;
        background-color: rgba(v.$primary, 0.1);
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
    }

    .order-number {
        margin: 2rem 0;
        
        span {
            display: block;
            font-size: 0.9rem;
            color: rgba(v.$font-color-dark, 0.7);
            margin-bottom: 0.5rem;
        }
        
        h2 {
            font-size: 2.5rem;
            margin: 0;
            padding: 0;
            border: none;
            color: v.$tertiary-dark;
        }
    }

    .success-note {
        color: rgba(v.$font-color-dark, 0.7);
        font-style: italic;
    }

    .success-modal .modal-footer {
        justify-content: center;
    }
</style> 