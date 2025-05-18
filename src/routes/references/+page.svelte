<script>
    import Footer from "$lib/components/Footer.svelte";
    import FooterTopBorder from "$lib/components/FooterTopBorder.svelte";
    import NavBar from "$lib/components/NavBar.svelte";

</script>

<NavBar />

<div class="content">
    <div class="wrapper">
        <div class="hero">
            <h1>References page</h1>
        </div>

        <div class="items-download box">
            <h2>Downloadable Files</h2>
            <p class="hint">Click on the specific file to start the download.</p>
            <a href="/files/worklog_webmaster25.pdf" download>Plan of Worklog</a>
            <a href="/">Student Copyright Checklist</a>
        </div>

        <div class="image-sources box">
            <h2>Images</h2>
            <p>All images and illustrations on this page were created by us.</p>
            <br>
            <p>With two exceptions:</p>
            <div class="images">
                <div class="image">
                    <h4>.svg image of the map of the USA:</h4>
                    <p>MapSVG. (n.d.). USA map. MapSVG. <a href="https://mapsvg.com/maps/usa">https://mapsvg.com/maps/usa</a></p>
                </div>
                <div class="image">
                    <h4>The TSA logo</h4>
                    <p>Technology Student Association. (n.d.). TSA logo [Logo]. <a href="https://tsaweb.org/ResourcePackages/Bootstrap5/assets/dist/img/TSA_logo.png">https://tsaweb.org/ResourcePackages/Bootstrap5/assets/dist/img/TSA_logo.png</a></p>
                </div>
            </div>
        </div>

        <div class="other-sources box">
            <h2>Other Sources</h2>
            <p>All sources used to gather information for this project are listed below:</p>
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
                    margin-bottom: 1.5rem;
                }
            }
        }

        .box {
            background-color: #fbf9f6;
            padding: 2rem;
            border-radius: 1rem;
            border: 2px solid rgba(160, 147, 125, 0.5);
            box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
            margin-bottom: 2rem;

            h2 {
                font-size: clamp(1.2rem, 5vw, 1.6rem);
                color: v.$font-color-dark;
            }

            a {
                font-size: clamp(0.9rem, 3vw, 1.1rem);
                color: white;
                text-decoration: none;
                margin-bottom: 1rem;
                display: block;
                background-color: v.$tertiary-dark;
                width: fit-content;
                padding: 0.5rem 1rem;
                cursor: pointer;
                border-radius: 0.5rem;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .items-download {
            .hint {
                font-size: clamp(0.8rem, 3vw, 1rem);
                color: v.$font-color-dark;
                background-color: transparent;
                padding: 0;
                margin-bottom: 1rem;
                cursor: default;

                &:hover {
                    text-decoration: none;
                }
            }
        }

        .image-sources {
            .images {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                a {
                    background-color: transparent;
                    padding: 0;
                    color: v.$font-color-dark;
                }
            }
        }
    }
</style>