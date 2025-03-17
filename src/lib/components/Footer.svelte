<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import leaf from "$lib/assets/news/leaf.png";
  import orange from "$lib/assets/news/orange.png";

  const currentYear = new Date().getFullYear();

  let isVisible = false;
  let footerElement: HTMLElement;

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
      { threshold: 0.1 }
    );

    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  });
</script>

<footer bind:this={footerElement}>
  {#if isVisible}
    <div class="footer-content" in:fade={{ duration: 800, delay: 200 }}>
      <div class="footer-section brand">
        <h2 class="brand-name">VERDANTIA</h2>
        <p class="tagline">Fresh, sustainable plant-based dining</p>
        <p class="description">
          Our ingredients are sourced from local farms and suppliers who share
          our commitment to sustainability and quality.
        </p>
        <div class="social-links">
          <a href="https://instagram.com/" aria-label="Instagram">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><rect x="2" y="2" width="20" height="20" rx="5" ry="5"
              ></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
              ></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg
            >
          </a>
          <a href="https://facebook.com/" aria-label="Facebook">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
              ></path></svg
            >
          </a>
          <a href="https://x.com/" aria-label="Twitter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/news">News</a></li>
        </ul>
      </div>

      <div class="footer-section hours">
        <h3>Opening Hours</h3>
        <ul class="hours-list">
          <li>
            <span class="day">Monday - Friday</span>
            <span class="time">11:30 AM - 10:00 PM</span>
          </li>
          <li>
            <span class="day">Saturday</span>
            <span class="time">10:00 AM - 11:00 PM</span>
          </li>
          <li>
            <span class="day">Sunday</span>
            <span class="time">10:00 AM - 9:00 PM</span>
          </li>
        </ul>
        <p class="special-hours">Brunch served weekends 10:00 AM - 2:00 PM</p>
      </div>

      <div class="footer-section contact">
        <h3>Contact Us</h3>
        <address>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              ></path><circle cx="12" cy="10" r="3"></circle></svg
            >
            17051 Gaylord Rd, Crest Hill, Illinois 60403
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              ></path></svg
            >
            <a href="tel:+16151234567">(615) 123-4567</a>
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path><polyline points="22,6 12,13 2,6"></polyline></svg
            >
            <a href="mailto:verdantia@tsaostwald.de">verdantia@tsaostwald.de</a>
          </p>
        </address>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">
          © {currentYear} Verdantia. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <a href="//tsaostwald.de">Ostwald TSA</a>
        </div>
      </div>
    </div>

    <div class="decorative-elements">
      <img src={leaf} alt="" class="leaf-1" />
      <img src={leaf} alt="" class="leaf-2" />
      <img src={orange} alt="" class="orange-1" />
    </div>
  {/if}
</footer>

<style lang="scss">
  @use "../styles/variables" as v;

  * {
    font-family: sans-serif;
  }

  footer {
    background-color: v.$tertiary-dark;
    color: v.$font-color-light;
    position: relative;
    overflow: hidden;
    border-top: 6px solid v.$primary;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    position: relative;
    z-index: 2;
  }

  .brand-name {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    font-family: "DynaPuff Regular", serif;
    color: v.$font-color-light;
  }

  .tagline {
    font-style: italic;
    margin-bottom: 1rem;
    color: v.$font-color-light;
    opacity: 0.8;
  }

  .description {
    margin-bottom: 1.5rem;
    line-height: 1.5;
    font-size: 0.95rem;
    color: v.$font-color-light;
    opacity: 0.7;
  }

  .social-links {
    display: flex;
    gap: 1rem;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: rgba(v.$font-color-light, 0.1);
      border-radius: 50%;
      color: v.$font-color-light;
      transition: all 0.3s ease;

      &:hover {
        background-color: v.$primary;
        transform: translateY(-3px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .footer-section {
    h3 {
      position: relative;
      font-family: "DynaPuff Regular", serif;
      color: v.$font-color-light;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        background-color: v.$primary;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 0.75rem;

        &:last-child {
          margin-bottom: 0;
        }

        a {
          color: v.$font-color-light;
          opacity: 0.8;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;

          &::after {
            content: "";
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -3px;
            left: 0;
            background-color: v.$primary;
            transition: width 0.3s ease;
          }

          &:hover {
            color: v.$font-color-light;
            opacity: 1;

            &::after {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .hours-list {
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: v.$font-color-light;
      opacity: 0.8;

      .day {
        font-weight: 500;
      }

      .time {
        color: v.$font-color-light;
        opacity: 0.6;
      }
    }
  }

  .special-hours {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(v.$font-color-light, 0.1);
    font-style: italic;
    color: v.$font-color-light;
    opacity: 0.7;
    font-size: 0.9rem;
  }

  address {
    font-style: normal;

    p {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: v.$font-color-light;
      opacity: 0.8;

      svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        margin-top: 3px;
      }

      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: v.$primary;
        }
      }
    }
  }

  .button {
    display: inline-block;
    background-color: v.$primary;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    margin-top: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: darken(v.$primary, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
  }

  .footer-bottom {
    background-color: darken(v.$tertiary-dark, 5%);
    padding: 1.5rem 2rem;
    position: relative;
    z-index: 2;
  }

  .footer-bottom-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .copyright {
    color: v.$font-color-light;
    opacity: 0.6;
    font-size: 0.9rem;
  }

  .footer-bottom-links {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;

    a {
      color: v.$font-color-light;
      opacity: 0.6;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;

      &:hover {
        color: v.$primary;
      }
    }

    .separator {
      color: v.$font-color-light;
      opacity: 0.3;
      font-size: 0.8rem;
    }
  }

  .decorative-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .leaf-1 {
      position: absolute;
      top: 10%;
      right: 5%;
      width: 150px;
      opacity: 0.07;
      transform: rotate(30deg);
    }

    .leaf-2 {
      position: absolute;
      bottom: 15%;
      left: 7%;
      width: 120px;
      opacity: 0.07;
      transform: rotate(-15deg);
    }

    .orange-1 {
      position: absolute;
      bottom: 50%;
      right: 20%;
      width: 80px;
      opacity: 0.07;
    }
  }

  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 2.5rem;
      padding: 3rem 1.5rem;
    }

    .footer-bottom-content {
      flex-direction: column;
      text-align: center;
    }

    .footer-bottom-links {
      justify-content: center;
    }

    .footer-section.brand {
      text-align: center;

      .social-links {
        justify-content: center;
      }
    }

    .footer-section h3::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .footer-section {
      text-align: center;

      h3 {
        text-align: center;
      }
    }

    .hours-list li {
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    address p {
      justify-content: center;
    }

    .decorative-elements {
      .leaf-1 {
        width: 100px;
      }

      .leaf-2,
      .orange-1 {
        display: none;
      }
    }
  }
</style>
