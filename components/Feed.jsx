"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.length > 0 &&
        data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const searchPosts = (key) => {
    const getLowercaseKey = key.toLowerCase();
    const filteredData = posts.map((post) => {
      if (
        post.prompt.toLowerCase().includes(getLowercaseKey) ||
        post.tag.toLowerCase().includes(getLowercaseKey) ||
        post.creator.username.toLowerCase().includes(getLowercaseKey)
      ) {
        return post;
      }
    });

    return filteredData.filter((obj) => obj !== undefined);
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        setSearchedData(searchPosts(e.target.value));
      }, 500)
    );
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    setSearchedData(searchPosts(tag));
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchText.length > 0 ? searchedData : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
