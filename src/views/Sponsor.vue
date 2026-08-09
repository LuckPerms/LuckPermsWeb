<template>
  <main class="sponsor overflow-y-auto">
    <section class="hero">
      <div class="container flex flex-col items-center">
        <div class="flex items-center justify-center">
          <img class="w-32 m-8 md:w-64 md:m-16" src="@/assets/logo.svg" alt="LuckPerms">
          <font-awesome-layers class="relative inline-block text-[2rem] w-8 md:text-[4rem] md:w-32">
            <font-awesome icon="heart" />
            <font-awesome icon="heart" />
          </font-awesome-layers>
          <img class="w-32 m-8 md:w-64 md:m-16" src="@/assets/bisect.svg" alt="BisectHosting">
        </div>
        <h1 class="mt-0 mx-16 mb-4 text-center">LuckPerms has partnered with BisectHosting!</h1>
        <p class="text-[1.5rem] w-full max-w-[60rem] text-center mb-16 px-8">BisectHosting are Minecraft server hosting experts, ready to help you create and host
          your very own server! They also have special discounts available for LuckPerms
          users - read on to find out more!</p>
      </div>
    </section>

    <section class="hero resources cta">
      <div>
        <a class="bg-brand text-black px-8 py-2 no-underline text-[2rem] font-bold my-8 text-center" href="https://bisecthosting.com/luck" target="_blank" v-on:click="logClick">
          Create your server now!
        </a>
        <p class="text-[1.5rem] w-full max-w-[44rem] text-center px-8">Click the link above to go to the BisectHosting website to use their panel to create
          your new server!</p>
      </div>
      <div>
        <a
          class="bg-brand text-black px-8 py-2 no-underline text-[2rem] font-bold my-8 text-center"
          href="https://www.bisecthosting.com/clients/submitticket.php?step=2&deptid=1"
          target="_blank"
          v-on:click="logClick"
        >
          Chat to BisectHosting support
        </a>
        <p class="text-[1.5rem] w-full max-w-[44rem] text-center px-8">If you have any questions, use the button above to get in touch with the friendly
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
          <hr class="border-brand w-48 mt-4 mb-8 mx-auto">
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
import { useHead } from '@unhead/vue';

export default {
  name: 'Sponsor',
  setup() {
    useHead({
      title: 'Sponsor',
    });
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

<style>
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

  .icon:first-child svg {
    color: red;
    animation: pulse 1s infinite ease-out;
  }

  .icon:last-child svg {
    color: hotpink;
    animation: heartbeat 1s infinite ease-out;
  }
</style>
