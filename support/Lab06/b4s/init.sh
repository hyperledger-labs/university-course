set -ex
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Installs dependencies for the scripts for students-union
cd "${DIR}/organization/students-union/utils"
npm install
. initStudentsUnion.sh

#Installs dependencies for the scripts for universities
cd "${DIR}/organization/university/utils"
npm install
. initUniversity.sh

#Blockchain Client dependencies for students-union
cd "${DIR}/organization/students-union/b4s_client"
npm install

#Blockchain Client dependencies for university
cd "${DIR}/organization/university/b4s_client"
npm install