class meta {
  constructor(attr = {}, routes = ["/", "/"]) {
    console.log(attr);
    this.default = {
      domain: "sssmediacentre.org",
      url: attr.url === undefined ? "" : attr.url,
      title:
        "Sri Sathya Sai Media Centre | Spreading Bhagawan Sri Sathya Sai Baba's message of love through audio, video, and articles.",
      description:
        "Sri Sathya Sai Media Centre (SSSMC), formerly known as Radio Sai, is the one stop destination for devotees, for All things Sai. Audio tracks, Video content, and articles are put out regularly, in addition to release of rare and archival content of Bhagawan Sri Sathya Sai Baba",
      keywords:
        "Sri Sathya Sai, Radio Sai, sssmc, sri sathya sai media centre, sathya sai bhajans, sathya sai, sai baba, baba, vedam, bhajans, sai baba books, sai baba videos, sathya sai devotional songs, spiritual, Sathya Sai Speaks, Sai Kulwant Hall, Prasanthi Nilayam, Prasanthi Nilayam Live",
      images: {
        social: "/sssmc_social_1.jpg",
        og: "/sssmc_social_1.jpg",
      },
      app: {
        facebook: {
          id: "",
          username: "",
          page: "",
        },
        twitter: {
          id: "",
          username: "",
          page: "",
        },
        Image: {
          default: "",
          og: "",
          twitter: "",
        },
      },
    };
    this.routes = routes;
  }

  route = (find, id = "") => {
    let _routes = {
      "/": {
        domain: "sssmediacentre.org",
        url: attr.url === undefined ? "" : attr.url,
        title:
          "Sri Sathya Sai Media Centre | Spreading Bhagawan Sri Sathya Sai Baba's eternal message of Love and Service.",
        description:
          "Sri Sathya Sai Media Centre (SSSMC), formerly known as Radio Sai, is the one stop destination for devotees, for All things Sai. Audio tracks, Video content, and articles are put out regularly, in addition to release of rare and archival content of Bhagawan Sri Sathya Sai Baba",
        keywords:
          "Sri Sathya Sai, Radio Sai, sssmc, sri sathya sai media centre, sathya sai bhajans, sathya sai, sai baba, baba, vedam, bhajans, sai baba books, sai baba videos, sathya sai devotional songs, spiritual, Sathya Sai Speaks, Sai Kulwant Hall, Prasanthi Nilayam, Prasanthi Nilayam Live",
        images: {
          social: "/sssmc_social_1.jpg",
          og: "/sssmc_social_1.jpg",
        },
      },
      "/read": {
        domain: "sssmediacentre.org",
        url: attr.url === undefined ? "" : attr.url,
        title: "SSSMC | Read",
        description:
          "Read articles on Bhagawan Sri Sathya Sai Baba, and News updates and announcements from Prasanthi Nilayam",
        keywords:
          "Sri Sathya Sai, Radio Sai, sssmc, sri sathya sai media centre, sathya sai bhajans, sathya sai, sai baba, baba, vedam, bhajans, sai baba books, sathya sai baba articles, sai baba speeches, prasanthi nilayam announcements, sai baba videos, sathya sai devotional songs, spiritual, Sathya Sai Speaks, Sai Kulwant Hall, Prasanthi Nilayam, Prasanthi Nilayam Live",
        images: {
          social: "/sssmc_social_1.jpg",
          og: "/sssmc_social_1.jpg",
        },
      },
      "/watch": {
        domain: "sssmediacentre.org",
        url: attr.url === undefined ? "" : attr.url,
        title: "SSSMC | Watch",
        description:
          "Watch videos, documentaries, and rare footage on Bhagawan Sri Sathya Sai Baba",
        keywords:
          "Sri Sathya Sai, Radio Sai, sssmc, sri sathya sai media centre, sathya sai bhajans, sathya sai, sai baba, baba, vedam, bhajans, sai baba speeches, prasanthi nilayam announcements, sai baba videos, Sathya Sai Baba Discourse Videos, Sathya Sai Baba rare footage, Sathya sai baba videos, sathya sai baba interviews, devotees of sathya sai baba interviews, samarpan talks, devotee experiences sathya sai, sathya sai devotional songs, spiritual, Sathya Sai Speaks, Sai Kulwant Hall, Prasanthi Nilayam, Prasanthi Nilayam Live",
        images: {
          social: "/sssmc_social_1.jpg",
          og: "/sssmc_social_1.jpg",
        },
      },
      "/listen": {
        domain: "sssmediacentre.org",
        url: attr.url === undefined ? "" : attr.url,
        title: "SSSMC | Listen",
        description:
          "Hear audio tracks, of bhajans, discourses, devotee experiences, radio talk shows, live offerings at Sai Kulwant Hall, Student experiences and programmes, on Bhagawan Sri Sathya Sai Baba.",
        keywords:
          "Sri Sathya Sai, Radio Sai, sssmc, sri sathya sai media centre, sathya sai bhajans, sathya sai, sai baba, baba, vedam, bhajans, sai baba speeches, prasanthi nilayam announcements, sai baba videos, Sathya Sai Discourses, Sathya sai bhajans, samarpan talks, students of sri sathya sai, sai students songs, sathya sai devotional songs, spiritual, Sathya Sai Speaks, Sai Kulwant Hall, Prasanthi Nilayam, Prasanthi Nilayam Live",
        images: {
          social: "/sssmc_social_1.jpg",
          og: "/sssmc_social_1.jpg",
        },
      },
    };
    return _routes[find] === undefined ? this.default : _routes[find];
  };

  async initialize() {
    var axios = require("axios").default;
    const options = {
      method: "GET",
      url:
        `${this.default.url}/api/public/` +
        `tree?qry=%7B"id"%3A"YPGtLBNsnmSUacFNUkT8"%7D`,
      headers: {},
    };
    this.response = false;
    try {
      this.response = await axios.request(options);
      if (this.response.data !== undefined) {
        this.response = this.response.data;
      }
    } catch (ex) {
      this.response = ex;
      //  //console.log(ex);
    }
    return this.response;
  }

  _get = async (_route = "", data = this.default) => {
    // //console.log(this.routes);
    let i = await this.initialize();
    //console.log(i);
    return { data, ...this.route(_route[0]) };
  };
}

export default meta;
