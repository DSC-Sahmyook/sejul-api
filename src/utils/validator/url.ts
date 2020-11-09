const url_regex = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/;

export const isUrl = (url: string) => {
    return url_regex.test(url);
};
