import axios from "axios";

export async function fetchActivities() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/activities`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Activities Data");
  }
}

export async function fetchAllFaq() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/allFaq`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch All FAQ Data");
  }
}

export async function fetchBlog() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/blog`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Blog Data");
  }
}

export async function fetchCourse() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/course`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Course Data");
  }
}

export async function fetchEvents() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/events`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Event Data");
  }
}

export async function fetchFaq() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/faq`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch FAQ Data");
  }
}

export async function fetchServices() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/services`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Services Data");
  }
}

export async function fetchTeamData() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/teamData`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Team Data");
  }
}

export async function fetchTestimonial() {
  try {
    const response = await axios.get(
      `${process.env.API_END_POINT}/testimonial`
    );
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Testimonial Data");
  }
}

export async function fetchWork() {
  try {
    const response = await axios.get(`${process.env.API_END_POINT}/work`);
    const data = response.data; // Get the JSON data from the response
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Failed to fetch Work Data");
  }
}
