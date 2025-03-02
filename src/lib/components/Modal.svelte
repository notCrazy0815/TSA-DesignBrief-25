<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    export let showModal = false;
    export let title = '';
    
    function closeModal() {
        showModal = false;
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if showModal}
    <div 
        class="modal-backdrop" 
        on:click={closeModal} 
        transition:fade={{ duration: 300 }}
    >
        <div 
            class="modal-content"
            on:click|stopPropagation={() => {}}
            transition:scale={{ duration: 400, easing: quintOut, start: 0.8 }}
        >
            <div class="modal-header">
                <h2>{title}</h2>
                <button class="close-button" on:click={closeModal}>×</button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button class="btn-close" on:click={closeModal}>Close</button>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "../styles/variables" as v;
    
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background-color: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 
                    0 0 0 1px rgba(5, 113, 95, 0.1);
        position: relative;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, v.$tertiary, v.$tertiary-light);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 2px solid v.$tertiary-light-low-opacity;
        
        h2 {
            color: v.$tertiary-dark;
            font-family: "DynaPuff Regular";
            margin: 0;
        }
        
        .close-button {
            background: none;
            border: none;
            font-size: 2rem;
            color: v.$tertiary-light;
            cursor: pointer;
            line-height: 1;
            padding: 0 0.5rem;
            transition: color 0.2s;
            
            &:hover {
                color: v.$tertiary-dark;
            }
        }
    }
    
    .modal-body {
        padding: 1.5rem;
        line-height: 1.6;
    }
    
    .modal-footer {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid v.$tertiary-light-low-opacity;
        
        .btn-close {
            background-color: v.$tertiary-light;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0.7rem 1.5rem;
            font-family: "Inter 24pt Regular";
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
            
            &:hover {
                background-color: v.$tertiary;
            }
        }
    }
</style>
