FROM ubuntu:22.04

RUN <<EOF
  # Install build-time deps
  set -vex
  apt update
  apt install -y curl libfuse2 libglib2.0-0 file
  yes | unminimize
EOF

RUN <<EOF
  # Bundle into an AppImage
  set -vex
  # While the release is called "continuous", it's actually pretty stable, only 1 update this year
  [ `arch` = aarch64 ] && tag=aarch64 || tag=x86_64
  curl -L --fail https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-$tag.AppImage -o appimagetool
  chmod a+x appimagetool
EOF

RUN mkdir ./installer.AppDir/
COPY k3s/dist/bundle.tar ./installer.AppDir/
COPY build/api-image.tar ./installer.AppDir/
COPY dist/manifest.yaml ./installer.AppDir/
COPY installer.AppDir ./installer.AppDir/
# AppImageKit will create exact same arch AppImage as the kit itself
# Still, it mandates explicit evnironment variable if the AppRun is a script
# Or ARCH=x86_64
RUN env ARCH=arm_aarch64 ./appimagetool --appimage-extract-and-run installer.AppDir
