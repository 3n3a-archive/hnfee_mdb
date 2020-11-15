// USER.JS: Script to interact with the Hackerfeed API

html_temp = '<div class="card m-5" data-id="{0}"><div class="view overlay"><img src="{1}" onerror="imageError(this);" class="img-fluid" alt=""><a href="{2}"><div class="mask rgba-white-slight"></div></a></div><div class="card-body"><p class="card-text text-grey"><img class="mx-1" src="https://www.google.com/s2/favicons?domain={3}">{4}</p><h4 class=card-title"><a href="{5}">{6}</a></h4><p class="card-text"><strong>{7}</strong><span> &#8226; </span>{8}</p><p class="card-text"><strong>{9} points</strong><span> &#8226; </span><strong>{10} comments</strong></p></div></div>'

/* Function to format strings like in Python */
function format(fmt, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
}

/* Fetch data from API-Ednpoint & then return to other func */
function getFromAPI(url, callback) {
    var obj;
    fetch(url)
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => callback(obj))
}

/* Construct the URL: expand and have more than just 'top' articles but maybe also new ones */
function construct_url(e) {
    url_construct = [{ "base": "https://hackerfeed.dev/", "top": "news", "new": "newest", "show": "show" }]
    url = url_construct[0].base + url_construct[0][e] + "?page=1"
    return url
}

function capital_letter(str) {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

function load_articles(e) {
    console.log("loading articles..." + e)
    url_construction = construct_url(e)
    getFromAPI(url_construction, getData)
    changeTitle(capital_letter(e))
}

function getData(arrOfObjs) {
    var results = "";
    arrOfObjs.forEach((x) => {
        results += format(html_temp, x.id, x.image_url, x.url, x.domain, x.domain, x.url, x.title, x.user, x.time_ago, x.points, x.comments_count)
    })
    results += "";
    document.getElementById("articles").innerHTML = results;
}

/* function to make changing content of innerHTML more efficient */
function changeInnerHTML(id_item, content) {
    document.getElementById(id_item).innerHTML = content;
}

/* add a word to the title of the site */
function changeTitle(addition) {
    title_content = "Hackernews - " + addition
    changeInnerHTML("title", title_content)
    changeInnerHTML("title_h2", title_content)
}

function imageError(x) {
    x.style.display = 'none'
}

function click_event(a) {
    // a: id_element; b: article_type
    document.getElementById(a + '_btn').addEventListener("click", function () { load_articles(a) })
}

/* after load --> load all articles */
load_articles('top')
click_event('top')
click_event('new')
click_event('show')


//document.getElementById("top_btn").addEventListener("click", function () { load_articles('top') })
//document.getElementById("new_btn").addEventListener("click", function () { load_articles('new') })
//document.getElementById("show_btn").addEventListener("click", function () { load_articles('show') })
