<div class="footer">
    <div class="footer-content">
        <h1>Verdantia</h1>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .footer {
        width: 100vw;
        background-color: #fff;
        padding: 2rem 2rem;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

        .footer-content {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            h1 {
                width: 100%;
                font-size: clamp(30px, 15vw, 600px);
                line-height: 1;
                text-align: center;
            }
        }
    }
</style>