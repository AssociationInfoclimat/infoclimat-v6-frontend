<script setup lang="ts">
import cx from 'classnames'
import { ref } from 'vue'

/**
 * [index_carte_2017.php]
 * menus were like:
 * ```
 *  <li>
 *     <a href="#" onclick="return updateParamFromMap('meteoalerte')" id="homelink_meteoalerte">Observations</a>
 *  </li>
 * ```
 */
const props = defineProps<{
  liClass?: string
  linkClass?: string
  id?: string
  onclick?: () => void
  label: string
  href?: string
  selected?: boolean

  /**
   * [index_carte_2017.php]
   * submenus were like:
   * ```
   *  <ul style="display:none">
   *                 <li><a href="#" onclick="return updateParamFromMap('radaric')">Voir la carte seule</a></li>
   *                 <li><a class="superpose-radaric" href="#" onclick="return overlayLayer('radaric');">Superposer &agrave; cette carte</a></li>
   *                 <li><a href="#" onclick="return updateParamFromMap('colorac60radaric')">Accumulations sur 1h</a></li>
   *                 <
   *                ```
   */
  submenus?: {
    label: string
    class?: string
    href: string
    onclick?: () => void
    selected?: boolean
  }[]
}>()

const handleClick = (event: MouseEvent, onclick?: () => void) => {
  if (!onclick) {
    return
  }

  event.preventDefault()
  onclick()
}

//
// We actually should use css (:hover) for this behaviour but lets keep the old behaviour for now.
//
const showSubmenus = ref<boolean>(false)
const handleHover = (event: MouseEvent) => {
  showSubmenus.value = true
}
const handleMouseLeave = () => {
  showSubmenus.value = false
}
</script>

<template>
  <li :class="cx(liClass, 'relative')" @mouseenter="handleHover" @mouseleave="handleMouseLeave">
    <a
      :href="href"
      :id="id"
      :class="
        cx(
          'text-white cursor-pointer font-exo py-1.5 px-6',
          linkClass,
          selected ? 'selectbar-selected' : '',
        )
      "
      @click="(event) => handleClick(event, onclick)"
      >{{ label }}</a
    >
    <template v-if="submenus">
      <ul
        :class="
          cx(
            'submenus',
            'absolute top-full left-0 overflow-hidden',
            'transition-opacity duration-300',
            !showSubmenus ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[500px]',
          )
        "
      >
        <template v-for="submenu in submenus" :key="submenu.label">
          <li>
            <a
              :href="submenu.href"
              :class="submenu.class"
              @click="(event) => handleClick(event, submenu.onclick)"
            >
              {{ submenu.label }}
            </a>
          </li>
        </template>
      </ul>
    </template>
  </li>
</template>

<style scoped>
/*  
 Since latest tailwind, when @apply, 
 we need to use `@reference "tailwindcss";` (https://tailwindcss.com/docs/functions-and-directives#apply-directive) 
*/
@reference "@/assets/base.less";

li {
  list-style-type: none;
}
li a {
  display: block;
  /*
  height: 25px;
  line-height: 25px;
  */
  font-family: Exo, sans-serif;
  text-decoration: none;
  color: #eee;
  font-size: 15px;
  min-width: 60px;
  outline: none;
  transition: all 0.3s ease-out;
}
li a:hover {
  color: #c3ff58;
}
li a.selectbar-selected {
  color: white;
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, rgba(0, 0, 0, 0.65)),
    color-stop(100%, rgba(0, 0, 0, 0))
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0) 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0) 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); /* IE10+ */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
  border-bottom: 2px solid #c3ff58;
}

li a.selectbar-bottom-selected {
  color: white;
  background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 100%); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, rgba(0, 0, 0, 0)),
    color-stop(100%, rgba(0, 0, 0, 0.65))
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.65) 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    top,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.65) 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 100%); /* IE10+ */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=0 ); /* IE6-9 */
  border-top: 2px solid #c3ff58;
}

.submenus {
  background: #2c2c2c;
  background: rgba(44, 44, 0, 0.85);

  width: 250px;
  @apply flex-col gap-2;
}
.submenus li {
  @apply p-1;
}
.submenus li a {
  @apply text-xs;
}
</style>
