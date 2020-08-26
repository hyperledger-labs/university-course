docker-compose -f ./../basic-network/docker-compose.yml down
docker rm -f $(docker ps -aq)
docker rmi $(docker images |grep 'dev')
docker volume prune -f