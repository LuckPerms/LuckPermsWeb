<template>
  <main class="sponsor">
    <section class="hero">
      <div class="container">
        <div>
          <img src="@/assets/logo.svg" alt="LuckPerms">
          <font-awesome-layers>
            <font-awesome icon="heart" />
            <font-awesome icon="heart" />
          </font-awesome-layers>
          <img src="@/assets/bisect.svg" alt="BisectHosting">
        </div>
        <h1>LuckPerms has partnered with BisectHosting!</h1>
        <p>BisectHosting are Minecraft server hosting experts, ready to help you create and host
          your very own server! They also have special discounts available for LuckPerms
          users - read on to find out more!</p>
      </div>
    </section>

    <section class="hero resources cta">
      <div>
        <a href="https://bisecthosting.com/luck" target="_blank" v-on:click="logClick">
          Create your server now!
        </a>
        <p>Click the link above to go to the BisectHosting website to use their panel to create
          your new server!</p>
      </div>
      <div>
        <a
          href="https://www.bisecthosting.com/clients/submitticket.php?step=2&deptid=1"
          target="_blank"
          v-on:click="logClick"
        >
          Chat to BisectHosting support
        </a>
        <p>If you have any questions, use the button above to get in touch with the friendly
          BisectHosting support team!
        </p>
      </div>
    </section>

    <div class="container">
      <section class="resources">
        <div>
          <h2>Why BisectHosting?</h2>
          <ul>
            <li>
              BisectHosting is a <strong>trusted</strong> and well established hosting provider in the
              community, and have already been serving many of our users for a number of years.
            </li>
            <li>
              They provide an <strong>outstanding</strong> level of service we're happy to
              recommend. We've personally used their product and can vouch for how awesome it is!
            </li>
            <li>
              By using our discount code, not only do you get a better deal on your hosting plan,
              but it also directly <strong>supports</strong> us in return, allowing us to continue
              developing and providing LuckPerms for everyone to enjoy!
            </li>
          </ul>
          <hr>
          <p>
            We'd like to thank Bisect for sponsoring open source projects like ours and enabling
            us to continue to provide LuckPerms for free to the community, for all to enjoy.
            They're awesome &amp; their support is much appreciated! 😎
          </p>
        </div>
        <div>
          <h2>Special Offer for LuckPerms users (that's you!)</h2>
          <p>
            BisectHosting are generously giving LuckPerms users a massive <strong>25% off</strong>
            the first month of any of their game server hosting plans.
          </p>
          <p>
            Already have a server hosted somewhere else? Not to worry! Bisect are offering to
            give <strong>two weeks of hosting for free</strong> and <strong>match the price of
            your existing plan</strong> if you transfer your server to them! Get all of the
            benefits of their Premium package, and support LuckPerms at the same time! What's
            not to love?! 💚
          </p>
          <p>
            <font-awesome icon="arrow-circle-right" />
            To get the <strong>25% off</strong> discount, all you need to do is enter the promo
            code "luck" when you checkout! 🎉
          </p>
          <p>
            <font-awesome icon="arrow-circle-right" />
            To take advantage of their <strong>2 weeks free + price-match</strong> offer, just get
            in touch with their support team and let them know you've come via us!
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>

export default {
  name: 'Sponsor',
  metaInfo: {
    title: 'Sponsor',
  },
  data() {
    return {
    };
  },
  computed: {

  },
  methods: {
    logClick() {
      // eslint-disable-next-line no-undef
      plausible('SponsorLinkOut');
    },
  },
};
</script>

<style lang="scss">
  main.sponsor {
    overflow-y: auto;

    .hero {
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;

        > div {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h1 {
          margin: 0 4rem 1rem;
          text-align: center;

          + p {
            font-size: 1.5rem;
            width: 100%;
            max-width: 60rem;
            text-align: center;
            margin-bottom: 4rem;
            padding: 0 2rem;
          }
        }
      }

      img {
        width: 8rem;
        margin: 2rem;

        @include breakpoint($md) {
          width: 16rem;
          margin: 4rem;
        }
      }

      .fa-layers {
        width: 2rem;

        @include breakpoint($md) {
          width: 8rem;
        }

        svg {
          font-size: 2rem;

          @include breakpoint($md) {
            font-size: 4rem;
          }

          &:first-child {
            color: red;
            animation: pulse 1s infinite ease-out;
          }

          &:last-child {
            color: hotpink;
            animation: heartbeat 1s infinite ease-out;
          }
        }
      }
    }

    hr {
      border-color: $brand-color;
      width: 12rem;
      margin: 1rem auto 2rem;
    }

    .cta {
      display: flex;
      //flex-direction: column;
      //align-items: center;
      //padding: 4rem;

      a {
        background: $brand-color;
        color: black;
        padding: .5rem 2rem;
        text-decoration: none;
        font-size: 2rem;
        font-weight: bold;
        margin: 2rem 0;
        text-align: center;
      }

      p {
        font-size: 1.5rem;
        width: 100%;
        max-width: 44rem;
        text-align: center;
        padding: 0 2rem;
      }
    }
  }

  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.2);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: .5;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
</style>
