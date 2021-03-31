FROM ubuntu

ARG NODE_ENV

ENV PORT=5000

RUN apt-get update -y
RUN apt-get install curl -y
RUN apt-get install gnupg -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN apt-get install yarn -y
RUN apt-get install git -y
RUN npm install nodemon -g
RUN apt-get install nano
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate
RUN apt-get install htop
RUN apt-get install ncdu


WORKDIR /home
RUN git clone https://mufakhruddin9417:Mufak1234.@bitbucket.org/mufakhruddin9417/agent-service.git
WORKDIR /home/agent-service
RUN yarn install --ignore-engines
#ARG PORT
#if [ "$arg" = "x" ] ; then echo Argument not provided ; else echo Argument is $arg ; fi
RUN if [ $NODE_ENV = "production" ];\
		then PORT=8000;\
	#else "$PORT" = "5000";\
	fi

EXPOSE $PORT

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
