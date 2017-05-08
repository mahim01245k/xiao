const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class SoundCloudCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundcloud',
            group: 'search',
            memberName: 'soundcloud',
            description: 'Searches SoundCloud for a song.',
            args: [
                {
                    key: 'query',
                    prompt: 'What do you want to search SoundCloud for?',
                    type: 'string',
                    parse: text => encodeURIComponent(text)
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://api.soundcloud.com/tracks?q=${query}&client_id=${process.env.SOUNDCLOUD_KEY}`);
            if (body.length === 0) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0xF15A22)
                .setAuthor(body[0].title, 'https://i.imgur.com/lFIz7RU.png')
                .setURL(body[0].permalink_url)
                .setThumbnail(body[0].artwork_url)
                .addField('**Artist:**',
                    body[0].user.username)
                .addField('**Download Count:**',
                    body[0].download_count, true)
                .addField('**Comment Count**',
                    body[0].comment_count, true)
                .addField('**Playback Count:**',
                    body[0].playback_count, true)
                .addField('**Favorited Count:**',
                    body[0].favoritings_count, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`An Error Occurred: ${err}`);
        }
    }
};
