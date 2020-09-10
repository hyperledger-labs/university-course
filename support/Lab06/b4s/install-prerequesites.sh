set -ex
echo 'install software'
sudo apt-get update

echo 'install npm v12'
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 12
nvm use 12

echo 'install helpers'
sudo apt-get install build-essential
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

echo 'install docker'
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"



sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo apt-get install docker-compose

echo 'giving docker permissions'
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

echo '================= POSSIBLE ISSUE ==========================================='
echo 'If proxy is being used, should add proxy to ~/.docker/config.json'
echo '================= SEE https://stackoverflow.com/questions/23111631/cannot-download-docker-images-behind-a-proxy ======================'


echo 'install fabric binaries, and retrieve images'
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 2.2.0 1.4.8
cd ..
mv b4s/fabric-samples/bin/* bin
rm -r b4s/fabric-samples
cd b4s
set -ex