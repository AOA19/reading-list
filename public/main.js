// Update Book Status
document.querySelectorAll(".status-select").forEach((select) => {
  select.addEventListener("change", function () {
    const bookId = this.dataset.bookId;
    const updatedStatus = this.value;

    fetch(`/books/${bookId}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "status": updatedStatus
      }),
    })
      .then((response) => {
        if(response.ok) 
          console.log("Reading status updated");
        // Move book to correct column
        const bookElement = this.closest(".book");
        const column = document.querySelector(`.${updatedStatus} .books`);
        
        if (bookElement && column) {
          column.appendChild(bookElement);
        }
          window.location.reload();
      })
      .catch((err) => console.error("Error:", err))
  })
})

// Delete Book
document.querySelectorAll(".delete-book").forEach((btn) => {
  btn.addEventListener("click", function() {

    let bookElement = btn.closest(".book");    
    const title = bookElement.querySelector(".book-title").innerText.trim();
    const author = bookElement.querySelector(".book-author").innerText.trim();
    const genre = bookElement.querySelector(".book-genre").innerText.trim();
    const link = bookElement.querySelector(".book-link").href.trim();


    fetch("/books", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
       "title": title,
       "author": author,
       "genre": genre,
       "link": link
      }),
    })
        .then((response) => {
          if (response.ok) {
            console.log("Deleted");
            window.location.reload();
          }
        })
        .catch((err) => console.log(err));
    });
  });
