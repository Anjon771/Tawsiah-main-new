function AddPlaceButton({ onClick }) {
  return (
    <div className="text-center mt-5 d-flex justify-content-center">
      <button className="btn-primary-custom" onClick={onClick}>
        + Add Place
      </button>
    </div>
  );
}

export default AddPlaceButton;
