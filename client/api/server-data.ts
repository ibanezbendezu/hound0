import axios from "../lib/axios"

export const profileDataRequest = async (username: string) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/profile/${username}`);
        const { repos, userProfile } = res.data;
        console.log(repos);

        repos.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); //descending, recent first

        return { userProfile, repos };
    } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
    }
}