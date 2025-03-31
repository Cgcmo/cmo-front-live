import { useState } from "react";
import { searchFace } from "@/utils/api";  // Import API function

const SearchComponent = () => {
    const [selectedFace, setSelectedFace] = useState(null);
    const [results, setResults] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFace(event.target.files[0]);
    };

    const handleSearch = async () => {
        if (!selectedFace) {
            alert("Please select a face image to search!");
            return;
        }

        const result = await searchFace(selectedFace);
        if (result.matches) {
            setResults(result.matches);
        } else {
            alert(result.message || "No matching faces found.");
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleSearch}>Search by Face</button>

            {results.length > 0 && (
                <div>
                    <h3>Matching Photos:</h3>
                    {results.map((match, index) => (
                        <div key={index}>
                            <p>{match.event_name} - {match.event_date}</p>
                            <img src={`http://127.0.0.1:5000/${match.image_path}`} alt="Match" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
