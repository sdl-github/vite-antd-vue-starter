<route lang="yaml">
meta:
  layout: PostLayout
</route>

<script setup lang="ts">

</script>

<template>
  <main id="main" class="main">
    <section>
      <article class="article">
        <!-- <div class:list={[{ "featured-header": featured, "article-header": !featured }]}> -->
        <div class="article-header">
          <div class="category component">
            <div class="component-content">
              <div class="category-eyebrow">
                <span class="category-eyebrow__category category_original">{type}</span>
                <span class="category-eyebrow__date">{dateFormated}</span>
              </div>
            </div>
          </div>
          <div class="pagetitle component">
            <div class="component-content">
              <h1 class="hero-headline">
                {title}
              </h1>
            </div>
          </div>
          <!-- <div class:list={[{ "featured-subhead": featured, "article-subhead": !featured }, "component"]}> -->
          <div class="article-subhead component">
            <div class="component-content">
              {description}
            </div>
          </div>

          <div class="tagssheet component">
            <div class="component-content">
              <a class="tag">
                {tag}
              </a>
            </div>
          </div>
        </div>
        <slot />
        <div class="component">
          <div class="component-content">
            <div class="article-copyright">
              <a class="content" href="https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh" target="_blank">版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）</a>
              <p class="content">
                作者： {frontmatter.author} 发表日期：{dateFormated}
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
