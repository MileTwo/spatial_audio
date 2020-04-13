<script>
  export let handleClick;
  export let pos;
  export let updateDistance;
  export let handleRecord;

  export let clients;
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

  {#each clients as c}
    <fieldset>
      <legend>Sound {c}</legend>
      X
      <input
        type="number"
        bind:value={pos[c].x}
        on:change={updateDistance(c)} />
      <input
        type="range"
        bind:value={pos[c].x}
        on:change={updateDistance(c)}
        min="-10"
        max="10" />
      Y
      <input
        type="number"
        bind:value={pos[c].y}
        on:change={updateDistance(c)} />
      <input
        type="range"
        bind:value={pos[c].y}
        on:change={updateDistance(c)}
        min="-10"
        max="10" />
    </fieldset>
    <audio id={'audio' + c} />

    <button
      on:click={() => {
        handleClick(c);
      }}>
      Start Playback User {c}
    </button>

    <button
      on:click={() => {
        handleRecord(c);
      }}>
      Start Recording User {c}
    </button>
  {/each}

</main>
