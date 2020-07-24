<template>
  <main>
    <section
      :style="{ gridTemplateColumns: !flipcolsrows ? colTemplate : rowTemplate, gridTemplateRows: '50px', gridColumnGap: gridcolumngap + 'px', gridRowGap: gridrowgap + 'px' }"
      class="colunits"
    >
      <div v-for="(col, i) in (!flipcolsrows ? colArr : rowArr)" :key="i">
        <input
          v-model.lazy="col.unit"
          @change="validateunit($event, i, 'col')"
          :class="[gridcolumns > 8 ? widthfull : '']"
          aria-label="Grid Template Column Measurements"
        >
        <div class="errors" v-if="errors.col.indexOf(i) !== -1">{{ $t("grid.realcssunit") }}</div>
      </div>
    </section>

    <section
      :style="{ gridTemplateColumns: '50px', gridTemplateRows: !flipcolsrows ? rowTemplate : colTemplate, gridColumnGap: gridcolumngap + 'px', gridRowGap: gridrowgap + 'px' }"
      class="rowunits"
    >
      <div v-for="(row, i) in (!flipcolsrows ? rowArr : colArr)" :key="i">
        <input
          v-model.lazy="row.unit"
          @change="validateunit($event, i, 'row')"
          aria-label="Grid Template Row Measurements"
        >
        <div class="errors" v-if="errors.row.indexOf(i) !== -1">{{ $t("grid.realcssunit") }}</div>
      </div>
    </section>

    <div
      id="gridcontainer"
      :class="useRealPostsDetails && posts.length ? 'real-posts' : 'abstract'"
    >
      <section
        v-if="!(useRealPostsDetails && posts.length)"
        class="grid"
        :style="{ gridTemplateColumns: !flipcolsrows ? colTemplate : rowTemplate, gridTemplateRows: !flipcolsrows ? rowTemplate : colTemplate, gridColumnGap: gridcolumngap + 'px', gridRowGap: gridrowgap + 'px' }"
      >
        <div
          v-for="(item, i) in divNum"
          :key="i"
          :class="'box' + i"
          :data-id="item"
        ></div>
      </section>

      <section
        class="grid gridchild"
        :style="{ gridTemplateColumns: !flipcolsrows ? colTemplate : rowTemplate, gridTemplateRows: !flipcolsrows ? rowTemplate : colTemplate, gridColumnGap: gridcolumngap + 'px', gridRowGap: gridrowgap + 'px' }"
      >
        <div
          v-for="(child, i) in childarea"
          :key="child.gridArea"
          :class="['child-'+i,'card-nth_'+child.nthPost, 'card-image-weight_'+child.imageWeight, 'card-meta-details_'+child.metaDetails, 'card-aspect-ratio-type_'+child.aspectRatioType]"
          :style="{ gridArea: child.gridArea }"
        >

          <ul
            v-if="!(useRealPostsDetails && posts.length)"
            class="details">
            <li>Nth Post: {{child.nthPost}}</li>
            <li>Image Weight Value: {{child.imageWeight}}</li>
            <li>Meta Details Value: {{child.metaDetails}}</li>
          </ul>

          <div v-else class="ui card fluid">
            <div class="image">
              <img :src="posts[i % posts.length].jetpack_featured_media_url">
            </div>
            <div class="content">
              <a class="header" :href="posts[i % posts.length].link"><h2>{{posts[i % posts.length].title.rendered}}</h2></a>
              <div class="meta">
                <span class="date">Published on {{posts[i % posts.length].date}}</span>
              </div>
              <div v-if="['vertical-tall', 'vertical-extreme'].includes(child.aspectRatioType)" class="description excerpt" v-html="posts[i % posts.length].excerpt.rendered"></div>
              <p></p>
              <div class="description excerpt" v-html="posts[i % posts.length].excerpt.rendered"></div>
            </div>
            <div class="extra content">
              <a>
                <i class="comment icon"></i>
                22 Comments
              </a>
              <div class="right floated author">
                <img class="ui avatar image" :src="posts[i % posts.length]._embedded.author[0].avatar_urls['48']"> {{posts[i % posts.length]._embedded.author[0].name}}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!--gridcontainer-->
  </main>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      child: {},
      widthfull: "widthfull",
      errors: {
        col: [],
        row: []
      }
    };
  },
  computed: {
    ...mapState([
      "gridcolumngap",
      "gridrowgap",
      "colArr",
      "rowArr",
      "gridcolumns",
      "gridrows",
      "childarea",
      "flipcolsrows",
      "useRealPostsDetails", "posts"
    ]),
    ...mapGetters(["rowTemplate", "colTemplate", "divNum"])
  },
  methods: {
    validateunit(e, i, direction) {
      let unit = e.target.value;
      let check =
        /fr$/.test(unit) ||
        /px$/.test(unit) ||
        /%$/.test(unit) ||
        /em$/.test(unit) ||
        /rem$/.test(unit) ||
        /vw$/.test(unit) ||
        /vh$/.test(unit) ||
        /vmin$/.test(unit) ||
        /q$/.test(unit) ||
        /mm$/.test(unit) ||
        /cm$/.test(unit) ||
        /in$/.test(unit) ||
        /pt$/.test(unit) ||
        /pc$/.test(unit) ||
        /ex$/.test(unit) ||
        /ch$/.test(unit) ||
        /minmax/.test(unit) ||
        ["auto", "min-content", "max-content"].includes(unit) ||
        parseInt(unit, 10) === 0; // allow 0 as a valid value without a unit

      if (!check) {
        this.errors[direction].push(i);
      } else {
        this.errors[direction].splice(this.errors[direction].indexOf(i), 1);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
main {
  width: calc(70vw - 50px);
  height: calc(70vh - 50px);
  margin: 15px 0 0 75px;

  @media screen and (max-width: 1500px) {
    margin: 15px 0 0 60px;
  }
}

@mixin colors($max, $color-frequency) {
  $color: 300 / $max;

  // fruit loops!
  @for $i from 1 through $max {
    div[class*="child"]:nth-child(#{$i}) {
      background: hsla(($i - 15) * ($color * 1.5), 80%, 30%, 0.7);
      border: 1px solid #ddd;
    }
  }
}

.gridchild {
  div {
    ul {
      margin:0;
      list-style: none;
      padding: 5px 0 0 5px;
      font-size: 0.9em;
      line-height: 1.3em;
    }
  }
}

#gridcontainer {
  border: 1px solid #08ffbd;
  width: 100%;
  height: 100%;
  z-index: 0;
  position: relative;
  background: #131321; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #131321 0%,
    #1f1c2c 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#131321', endColorstr='#1f1c2c',GradientType=0 ); /* IE6-9 */
  box-shadow: 0 2px 20px 0 #000;
}

.grid {
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
  @include colors(20, 100);
  p {
    padding: 0 10px;
  }

  div[class*="box"] {
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
    border: 1px dotted white;
    transition: 0.2s all ease;
    position: relative;
    z-index: 1000;
    opacity: 0.5;
  }
}

.rowunits,
.colunits {
  display: grid;
  div {
    text-align: center;
    position: relative;
  }
}

.rowunits {
  margin-left: -70px;
  float: left;
  height: 100%;
  div {
    align-self: center;
  }

  @media screen and (max-width: 1500px) {
    margin-left: -60px;
    input {
      width: 30px;
    }
  }
}

.widthfull {
  width: 100%;
}

@media screen and (max-width: 700px) {
  main {
    width: calc(80vw - 50px);
    height: calc(40vh - 50px);
  }
}

.errors {
  position: absolute;
  bottom: -5px;
  border-radius: 4px;
  padding: 8px 12px;
  z-index: 1;
  font-weight: bold;
  width: 150px;
  min-height: 50px;
  background: #6d1a39;
}
</style>
