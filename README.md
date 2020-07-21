<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"/>
</a>

# Advanced Posts Collection Layout System (parametric layout generation)

### Site: [https://advanced-posts-collection-layout-system.netlify.app/](https://advanced-posts-collection-layout-system.netlify.app/)

A tool to explore the parametric generation of the block's layout. We aim to keep the number of parameters as low as possible, while aiming for a wide coverage of situations.

## Why

This exploration is helping us at [Pixelgrade](https://pixelgrade.com) develop a better Gutenberg block to display a stream of blog posts in line with our design philosophy: intuitive options with predictable effects; good design-driven results without having to make design decisions. After all, most people are not (good) designers; that doesn't mean most sites should end up with poor designs. We, the makers of site building tools, just need to do a better job.

We felt the need to create this intermediary exploratory tool because complexity tends to shoot through the roof with every additional variable. By keeping the mind somewhat separated from the actual implementation, we can gain confidence in the system we are building. Also, we can explore alternate routes with minimal costs.

## About the system

This is **a thinking and exploration tool** to help with **building a layout system that is predictable, intuitive, and flexible.** It is intended to be used as part of a WordPress Gutenberg block to lay out a single stream of posts (e.g. the latest posts, or posts from a certain category).

The primary aim is to bind together numerical clues about the design intent of the user with the visual hierarchy of the entire layout and individual posts. The user doesn't need to completely understand every parameter and he or she can play with it and explore it's limits.

The main parameters are the **lowest level** parameters available to the user. We will group and link these low-level parameters into higher order ones for an easier entry point. A "Surprise Me!" button is just what is needed for a fun start.

Bear in mind that each post's container **image weight and meta-details** values, coupled with the "area" and relative order of each post will be taken into account when choosing an appropriate internal layout for each post. So, for example, a very horizontal post with a low image weight and no meta-details, will use a markup and styling that will put a small image on the left, plus a title and small excerpt.

The interpretation of each post's attribute value is up to the site theme. The logic here doesn't prefer one visual style over another.

Oh.. please use your browser full-screen, preferably on a big display. I haven't focused on making everything responsive to a T.

I hope this inspires you in some way and **I would love to hear back from you** with details about *that way.* You can find more of my thoughts about various things of my site: [thinkwritecode.com](https://thinkwritecode.com)

## Credits

This tool started from or used bits and pieces of other open-source projects:
- https://github.com/sdras/cssgridgenerator (big 👏👏👏 )

## Project setup

```
yarn install
```

Compiles and hot-reloads for development

```
yarn run serve
```

Compiles and minifies for production

```
yarn run build
```

Run your tests

```
yarn run test
```

Lints and fixes files

```
yarn run lint
```

Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## License

This project is licensed under the MIT license.
