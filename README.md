# Positional Audio Meeting

This is a sample application demonstrating a proof of concept for creating a teleconference which includes positional audio using client-side processing. The goal of this application was to demo the ability to cluster users in a telecon but allow for mobility between groups.

This prototype is super basic, allowing for users to start talking, and even share a conversation but with a wild amount of lag. Basically, any time the stream is started, it starts from the beginning of the recording -- not very usable. However, the in-browser processing of location data worked!

Improvements needed:

- Better support for streaming. I believe we need to add some encoding and meta-data to the chunks being transmitted in order to make them able to be picked up mid-stream (not have to listen to the whole stream from the beginning).
- Support for autojoining a call
- Better UI for positioning
- Server-side audio processing (send one stream per client out instead of all the streams that are available.)

## To Run:

- Install frontend requirements: `pushd ui && npm install && popd`
- (Optional) Build the static user interface (if you want to use the non-reloading page at `/public`: `pushd ui && npm run build && cd ../api && mv ../ui/public/build ./ && cp ../ui/public/* ./build/`
- Install api requirements: `pushd api && npm install && popd`
- Run: `pushd api && node app`
