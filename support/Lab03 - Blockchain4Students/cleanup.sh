rm *.pem
docker system prune
docker rm -f $(docker ps -a | grep "blockchain-node-" | awk '{print $1}')
docker images -a | grep "blockchain4students" | awk '{print $3}' | xargs docker rmi -f