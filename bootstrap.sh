sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install apache2 php5 git -y
sudo mkdir /grip-config
sudo chown www-data /grip-config
cd /var/www/html
git clone git@github.com:codetheweb/Pigeon.git
