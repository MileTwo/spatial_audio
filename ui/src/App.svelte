<script>
  //   export let name;
  export let handleClick;
  export let buttonName;
  export let pos1;
  //   export let pos2;
  export let updateDistance;
  export let handleRecord;
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>

  <fieldset>
    <legend>Sound 1</legend>
    X
    <input type="number" bind:value={pos1.x} on:change={updateDistance()} />
    <input
      type="range"
      bind:value={pos1.x}
      on:change={updateDistance()}
      min="-10"
      max="10" />
    Y
    <input type="number" bind:value={pos1.y} on:change={updateDistance()} />
    <input
      type="range"
      bind:value={pos1.y}
      on:change={updateDistance()}
      min="-10"
      max="10" />
  </fieldset>
  <audio />

  <button on:click={handleClick}>{buttonName} Playback</button>
  <button on:click={handleRecord}>{buttonName} Recording</button>

</main>
