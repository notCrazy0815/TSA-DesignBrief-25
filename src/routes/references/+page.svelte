<script>
    import Footer from "$lib/components/Footer.svelte";
    import FooterTopBorder from "$lib/components/FooterTopBorder.svelte";
    import NavBar from "$lib/components/NavBar.svelte";

</script>

<NavBar />

<div class="content">
    <div class="wrapper">
        <div class="hero">
            <h1>References</h1>
        </div>

        <div class="items-download">
            <p>Plan of Worklog</p>
            <p>Student Copyright Checklist</p>
        </div>
    </div>

    <FooterTopBorder />
</div>

<Footer />

<style lang="scss">
    @use "../../lib/styles/variables" as v;
    @use "../../lib/styles/global" as g;

    .content {
        min-height: 100vh;
        position: relative;
        z-index: 2;
        background-color: v.$background-color-light;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .wrapper {
            width: 95%;
            max-width: 1200px;
            display: flex;
            flex-direction: column;

            .hero {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-top: 5rem;

                h1 {
                    font-size: clamp(1.4rem, 5vw, 3rem);
                    color: v.$tertiary-dark;
                }
            }
        }
    }
</style>