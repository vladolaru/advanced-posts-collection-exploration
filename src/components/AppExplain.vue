<template>
  <section>
    <p v-html="$t('explain.paragraph1')"></p>
    <p v-html="$t('explain.paragraph2')"></p>
    <p v-html="$t('explain.paragraph3')"></p>
    <p v-html="$t('explain.paragraph4')"></p>
    <p v-html="$t('explain.paragraph5')"></p>
    <p v-html="$t('explain.paragraph6')"></p>
    <p v-html="$t('explain.paragraph7')"></p>
    <p v-html="$t('explain.end-note')"></p>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.cursive {
  font-family: "Caveat", cursive;
  font-size: 25px;
  color: #ffd908;
  font-weight: normal;
  a,
  a:visited,
  a:active {
    color: #fb7826;
    text-decoration: underline;
  }
}

strong {
  color: #ffd908;
}
</style>
