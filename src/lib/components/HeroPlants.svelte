<script lang="ts">
    import branch1d from "$lib/assets/branches/branch_1d.png";
    import branch7d from "$lib/assets/branches/branch_7d.png";
    import branch8d from "$lib/assets/branches/branch_8d.png";
</script>

<div class="hero-plants">
    <div class="plant plant-small">
        <img src={branch1d} alt="branch 1d" />
    </div>
    <div class="plant plant-big">
        <img src={branch7d} alt="branch 7d" />
    </div>
    <div class="plant plant-small">
        <img src={branch8d} alt="branch 8d" />
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .hero-plants {
        display: flex;
        justify-content: center;
        align-items: end;
        opacity: 0.9;
        width: clamp(350px, 90%, 950px);
        height: 100%;

        .plant-small {
            width: 35%;
            transform: translateY(clamp(250px, 50vh, 400px));
            animation: moveUpSmall 1.2s ease-in-out forwards 2s;
        }

        .plant-big {
            width: 50%;
            transform: translateY(clamp(400px, 70vh, 700px));
            animation: moveUpBig 1.2s ease-in-out forwards 2s;
        }

        .plant {
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                transform: translateY(5px);
            }

            &:nth-child(1) {
                margin-right: -20%;
                z-index: 1;
            }

            &:nth-child(2) {
                z-index: 2;
            }

            &:nth-child(3) {
                margin-left: -20%;
                z-index: 1;
            }
        }

        @keyframes moveUpSmall {
            from {
                transform: translateY(clamp(250px, 50vh, 620px));
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 0.6;
            }
        }

        @keyframes moveUpBig {
            from {
                transform: translateY(clamp(400px, 70vh, 900px));
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    }
</style>