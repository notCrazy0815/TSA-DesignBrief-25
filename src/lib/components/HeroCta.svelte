<div class="hero-cta">
    <div class="hero-cta-bg"></div>
    <button class="cta-button">Direct to our menu</button>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .hero-cta {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(300%);
        animation: moveIn 1.5s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
        animation-delay: 2.5s;

        @keyframes moveIn {
            from {
                transform: translateY(300%);
            }
            to {
                transform: translateY(0);
            }
        }
        .hero-cta-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            border-radius: 15px;
            cursor: pointer;
            z-index: -1;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
        }

        &:hover {
            .hero-cta-bg {
                transform: scale(1.1);
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
            }
        }

        .cta-button {
            color: v.$font-color-dark;
            padding: 1.2rem 2.5rem;
            font-size: clamp(0.9rem, 1.2vw, 1.1rem);
            cursor: pointer;
            border: none;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            white-space: nowrap;
            background-color: transparent;
        }
    }
</style>