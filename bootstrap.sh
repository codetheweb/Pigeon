sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install apache2 php5 git -y
sudo mkdir /grip-config
sudo chown www-data /grip-config
cd /var/www/html
sudo rm index.html
git clone https://github.com/codetheweb/Pigeon.git
cp -r Pigeon/* /var/www/html
rm -f -R Pigeon
cd php/db
sudo chown www-data running startup
echo "Type this IP address in your browser to get started:"
hostname -I | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
