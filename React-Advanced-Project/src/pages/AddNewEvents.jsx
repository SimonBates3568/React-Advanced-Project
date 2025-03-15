export const AddNewEvents = () => {
    return ( 
        <form>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description" rows="3"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input type="date" className="form-control" id="date" />
            </div>
            <div className="form-group">
                <label htmlFor="time">Time</label>
                <input type="time" className="form-control" id="time" />
            </div>
            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" className="form-control" id="location" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
     );
}