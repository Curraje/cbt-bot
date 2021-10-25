import {Message, MessageEmbed} from 'discord.js';

export const paginationEmbed = async(msg: Message, pages: MessageEmbed[], emojiList = ['⏪', '⏩'], timeout = 120000): Promise<Message> => {
    if (!msg) {throw new Error('Channel is inaccessible.');} // && !msg.channel
    if (!pages) {throw new Error('Pages are not given.');}
    if (emojiList.length !== 2) {throw new Error('Need two emojis.');}
    let page = 0;
    const baseFooter: unknown[] = [];
    for(let i = 0; i < pages.length; i++) {
        if(pages[i].footer != null) {
            baseFooter.push(pages[i].footer?.text + "\n\n");
        }
        else{
            baseFooter.push("");
        }
    }
    //baseFooter  = pages[page].footer.text + "\n\n";
    let footer = `${baseFooter[page]}Page ${page+1} / ${pages.length}`;
    const curPage = await msg.channel.send(pages[page].setFooter(footer));
    for (const emoji of emojiList) {await curPage.react(emoji);}
    const reactionCollector = curPage.createReactionCollector(
        (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
        { time: timeout }
    );
    reactionCollector.on('collect', reaction => {
        reaction.users.remove(msg.author);
        switch (reaction.emoji.name) {
        case emojiList[0]:
            page = page > 0 ? --page : pages.length - 1;
            break;
        case emojiList[1]:
            page = page + 1 < pages.length ? ++page : 0;
            break;
        default:
            break;
        }


        footer =  `${baseFooter[page]}Page ${page + 1} / ${pages.length}`;
        //if(pages[page].footer != null)footer = pages[page].footer + "\n" + Page ${page + 1} / ${pages.length}`
        curPage.edit(pages[page].setFooter(footer));
    });
    reactionCollector.on('end', () => {
        if (!curPage.deleted) {
            curPage.reactions.removeAll();
        }
    });
    return curPage;
};

