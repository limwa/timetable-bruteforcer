FROM denoland/deno:1.25.0

WORKDIR /usr/app
COPY . .

RUN deno cache src/main.ts
CMD [ "deno", "run", "--allow-all", "src/main.ts" ]