<script lang="ts">
  import { scale, fly, fade } from "svelte/transition";
  import { elasticOut, quintOut } from "svelte/easing";
  import { onMount } from "svelte";

  // Import the images for background elements
  import flower from "$lib/assets/news/flower.png";
  import leaf from "$lib/assets/news/leaf.png";
  import lavender from "$lib/assets/news/lavender.png";
  import orange from "$lib/assets/news/orange.png";

  let email = "";
  let subscribed = false;
  let newsletterElement: HTMLElement;
  let isVisible = false;

  // Track if the component is in viewport for animation
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (newsletterElement) {
      observer.observe(newsletterElement);
    }

    return () => {
      if (newsletterElement) {
        observer.unobserve(newsletterElement);
      }
    };
  });

  function handleSubmit() {
    if (email && email.includes("@")) {
      subscribed = true;
      email = "";
    }
  }
</script>

<section class="newsletter" bind:this={newsletterElement}>
  {#if isVisible}
    <div class="background-elements">
      <img
        src={flower}
        alt=""
        class="bg-image flower"
        in:fly={{ x: -100, y: 50, duration: 1000, delay: 200 }}
      />
      <img
        src={leaf}
        alt=""
        class="bg-image leaf"
        in:fly={{ x: 100, y: -50, duration: 1000, delay: 300 }}
      />
      <img
        src={lavender}
        alt=""
        class="bg-image lavender"
        in:fly={{ x: -80, y: -30, duration: 1000, delay: 400 }}
      />
      <img
        src={orange}
        alt=""
        class="bg-image orange"
        in:scale={{ start: 0, duration: 800, delay: 500, easing: elasticOut }}
      />
    </div>

    <div class="content" in:fly={{ y: 30, duration: 800, delay: 100 }}>
      <h2 in:scale={{ start: 0.8, duration: 600 }}>
        Stay Fresh with Verdantia
      </h2>
      <div class="divider" in:scale={{ start: 0, duration: 800 }}></div>
      <p in:fade={{ duration: 800, delay: 300 }}>
        Subscribe to our newsletter for seasonal menu updates, exclusive event
        invitations, and plant-based cooking tips straight from our kitchen to
        yours.
      </p>

      {#if !subscribed}
        <form
          on:submit|preventDefault={handleSubmit}
          class="signup-form"
          in:fade={{ duration: 800, delay: 450 }}
        >
          <input
            type="email"
            bind:value={email}
            placeholder="Your email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        <p class="privacy-note" in:fade={{ duration: 800, delay: 600 }}>
          We respect your privacy and will never share your email. Unsubscribe
          anytime.
        </p>
      {:else}
        <div
          class="success-message"
          in:scale={{ start: 0.8, duration: 600, easing: quintOut }}
        >
          <div class="checkmark">✓</div>
          <p>Thank you for subscribing!</p>
          <p class="subtitle">Get ready for fresh content in your inbox.</p>
        </div>
      {/if}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "../styles/variables" as v;

  .newsletter {
    margin: 5rem 0 2rem;
    background-color: v.$background-color-light;
    padding: 4rem 3rem;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);

    .background-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;

      .bg-image {
        position: absolute;
        opacity: 0.5;

        &.flower {
          top: 10%;
          left: 5%;
          width: 100px;
          height: auto;
          transform: rotate(15deg);
        }

        &.leaf {
          bottom: 15%;
          right: 10%;
          width: 120px;
          height: auto;
          transform: rotate(-10deg);
        }

        &.lavender {
          top: 70%;
          left: 15%;
          width: 80px;
          height: auto;
          transform: rotate(30deg);
        }

        &.orange {
          top: 20%;
          right: 15%;
          width: 100px;
          height: auto;
        }
      }
    }

    .content {
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      text-align: center;

      h2 {
        color: v.$tertiary-dark;
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
        font-weight: bold;
        line-height: 1.1;
      }

      .divider {
        width: 80px;
        height: 4px;
        background: linear-gradient(90deg, v.$tertiary, v.$primary);
        border-radius: 2px;
        margin: 1.5rem auto;
      }

      p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        line-height: 1.6;
        color: v.$tertiary-dark;
        opacity: 0.85;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .signup-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;

      input {
        flex: 1;
        padding: 1rem 1.2rem;
        border: 2px solid transparent;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

        &:focus {
          border-color: v.$tertiary-light;
          outline: none;
          box-shadow: 0 4px 12px rgba(5, 113, 95, 0.1);
        }
      }

      button {
        background: linear-gradient(45deg, v.$tertiary, v.$tertiary-light);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0 1.8rem;
        font-family: "Inter 24pt Regular";
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 6px rgba(5, 113, 95, 0.2);
        font-weight: bold;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(5, 113, 95, 0.25);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .privacy-note {
      font-size: 0.85rem;
      opacity: 0.6;
      margin-top: 1rem;
    }

    .success-message {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 2.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 15px 30px rgba(5, 113, 95, 0.1);
      max-width: 500px;
      margin: 0 auto;
      border: 1px solid rgba(5, 113, 95, 0.1);

      .checkmark {
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, v.$tertiary, v.$tertiary-light);
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1.5rem;
      }

      p {
        margin-bottom: 0.5rem;
        color: v.$tertiary;
        font-weight: bold;
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 0;
      }
    }
  }

  @media (max-width: 768px) {
    .newsletter {
      padding: 3rem 1.5rem;
      margin: 3rem 0 1rem;

      .content {
        h2 {
          font-size: 2rem;
        }
      }

      .signup-form {
        flex-direction: column;

        button {
          width: 100%;
          padding: 1rem;
          margin-top: 0.5rem;
        }
      }

      .background-elements {
        .lavender,
        .orange {
          display: none;
        }

        .flower {
          opacity: 0.35;
          width: 80px;
        }

        .leaf {
          opacity: 0.35;
          width: 90px;
        }
      }
    }
  }
</style>
