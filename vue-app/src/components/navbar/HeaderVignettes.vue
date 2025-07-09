<script setup lang="ts">
// TODO:
// Chargement des vignettes depuis le back
//  à partir des info du user depuis le store du user
</script>

<template>
  <div class="photo-boxes">
    <div class="photo-box">
      <div class="boite_station div-inner-station">
        <div class="vignettes" style="line-height: 11px">
          <a class="station vignette-station-link" href="/stations-meteo/?s=07149"
            >Orly - Athis-Mon.</a
          >21h00, <b class="vignette-mini-temperature" style="color: #ffc600">26.3°C</b><br /><span
            style="color: #d4f3ff"
            class="vignette-mini-humidite"
            >40%</span
          >, <span style="color: #c5ffca" class="vignette-mini-pression">1023.3hPa</span><br /><span
            ><img
              class="vignette-mini-vdir"
              style="margin-bottom: -3px"
              alt="Vent de direction N"
              title="Vent de direction N"
            />
            <!-- src="/images/pictos_vent/N.png" -->
            <b class="vignette-mini-ventmoyen" style="color: white">14 km/h</b>
            <b class="vignette-mini-rafales" style="color: white">(raf. 25)</b></span
          ><span style="float: right" class="vignette-mini-pictogramme"> </span>
        </div>
      </div>
      <div class="boite_photo">
        <a
          href="/accueil/pass.php?a=1"
          style="
            overflow: hidden;
            box-shadow: 0 0 3px #000;
            width: 90px;
            height: 70px;
            display: inline-block;

            background-position: -0px 0px;
            text-decoration: none;
            border-radius: 4px;
          "
          class="lien_photolive_UKSQ"
        >
          <!-- onmouseover="$(this).find('div').show().find('div').html(`${JSON_PL['v1v']||''}&lt;br /&gt;${JSON_PL['l1l']||''}`).show();"
          onclick="$(this).attr('href',JSON_PL['photourl'.$nb_photolive.'x']);" -->
          <div class="itphoto_info" style="background-color: rgba(0, 0, 0, 0.7); display: none">
            <div style="padding: 5px; display: none">
              fin d'une belle journée d'été<br />Viriat (01)
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style></style>
