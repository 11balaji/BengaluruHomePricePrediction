# flask is a model that allows you to write python service which can serve http requests
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS extension
import util

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    print("Received request for location names")
    locations = util.get_location_names()
    print(f"Returning {len(locations)} locations")
    response = jsonify({
        'locations': locations
    })
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    print("Received request for price prediction")
    try:
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        bhk = int(request.form['bhk'])
        bath = int(request.form['bath'])
        
        print(f"Inputs: sqft={total_sqft}, location={location}, bhk={bhk}, bath={bath}")
        
        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        print(f"Estimated price: {estimated_price}")
        
        response = jsonify({
            'estimated_price': estimated_price
        })
        return response
    except Exception as e:
        print(f"Error in predict_home_price: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    print("Starting python flask server for house price prediction.")
    util.load_saved_artifacts()  # Load the model and location data when server starts
    print(f"Loaded {len(util.get_location_names())} locations")
    # Run on 0.0.0.0 to make it accessible from other devices/origins
    app.run(host='0.0.0.0', port=5000)