//Brad Stouffer 'QA Practical' Automation Tests

describe('todos list', function() {
	
	var enterToDo = element(by.xpath("//*[contains(@class, 'new-todo')]"));
	var newToDoDefaultText = element(by.xpath("//*[contains(@placeholder, 'What needs to be done?')]"));
	var editToDo = element(by.xpath("//*[contains(@class, 'edit')]"));
	var toDoHeader = element(by.xpath("//*[contains(@class, 'header')]"));
	
	function GetToDoRecord(toDoText) {
		var toDoRecord = element(by.xpath("//label[. = '" + toDoText + "']"));
		
		return toDoRecord;
	}
	
	function AddToDoRecord(toDoText) {
		var toDo_i;
		
		for(toDo_i = 0; toDo_i < toDoText.length; toDo_i++) {
			enterToDo.sendKeys(toDoText.charAt(toDo_i));
		}
		
		enterToDo.sendKeys(protractor.Key.ENTER);
	}
	
	function DeleteToDoRecord(toDoText) {
		
		browser.executeScript('arguments[0].click()',browser.driver.findElement(By.xpath("//label[. = '" + toDoText + "']/following-sibling::button")));
		
	}
	
	function MarkToDoAsDone(toDoText) {
		
		browser.executeScript('arguments[0].click()',browser.driver.findElement(By.xpath("//label[. = '" + toDoText + "']/preceding-sibling::input")));
		
	}
	
	function MarkAllToDosAsDone() {
				browser.executeScript('arguments[0].click()',browser.driver.findElement(By.xpath("//*[contains(@class, 'toggle-all')]")));
	}
	
	function EditToDo(toDoText) {
		var editText_i;
		
		var EditText = "I am now edited";
		
		browser.actions().doubleClick(GetToDoRecord(toDoText)).perform();
		browser.actions().click(editToDo).perform();
		browser.actions().doubleClick(editToDo).perform();
		
		for(editText_i = 0; editText_i < EditText.length; editText_i++) {
			browser.actions().sendKeys(EditText.charAt(editText_i)).perform();
		}
		
		browser.actions().sendKeys(protractor.Key.ENTER).perform();
		
		return EditText;		
	}
	
	function ClearCompletedToDos() {
		browser.executeScript('arguments[0].click()',browser.driver.findElement(By.xpath("//button[. = 'Clear completed']")));
	}
	
	function RecordPresent(toDoText) {
		
		return browser.isElementPresent(by.xpath("//label[. = '" + toDoText + "']"));
		
	}
	
	function GetDisplayedItemsLeft(toDoItemsLeft) {
		
		return element(by.xpath("//*[contains(@class, 'todo-count')]"));
		
	}
	
	beforeEach(function() {
		browser.get('http://todomvc.com/examples/angular2/');
	});
	
	afterEach(function() {
		browser.executeScript('window.sessionStorage.clear();');
		browser.executeScript('window.localStorage.clear();');
	});

	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('Angular2 • TodoMVC');
	});
	
	it('should have the correct header', function() {
		expect(toDoHeader.getText()).toEqual('todos');
	});
	
	it('should ask the question of what is needed to be done', function() {
		expect(newToDoDefaultText.isPresent()).toEqual(true);
	})
	
	it('should create a todo in the list', function() {
		var toDoEntry = 'First Thing to do';
		
		AddToDoRecord(toDoEntry);
		
		expect(GetToDoRecord(toDoEntry).getText()).toEqual(toDoEntry);
	});
	
	it('should delete a todo from the list', function() {
		var toDoEntryToDelete = 'I am a to do added and then deleted';
		
		AddToDoRecord(toDoEntryToDelete);
		
		DeleteToDoRecord(toDoEntryToDelete);
		
		expect(RecordPresent(toDoEntryToDelete)).toEqual(false);
	});
	
	it('checks the count of records displayed in the list', function() {
		var list = ["a", "b", "c", "d", "e", "f"];
		
		var recordCount;
		
		for(recordCount = 0; recordCount < list.length; recordCount++) {
			
			AddToDoRecord(list[recordCount]);
			
		}
		
		expect(GetDisplayedItemsLeft(recordCount).getText()).toEqual(recordCount + " items left");
		
		for(recordCount = 0; recordCount < list.length; recordCount++) {
			
			DeleteToDoRecord(list[recordCount]);
			
			expect(RecordPresent(list[recordCount])).toEqual(false);
			
		}
		
		expect(RecordPresent(GetDisplayedItemsLeft(recordCount))).toEqual(false);
	});
	
	it('checks the todos as being done after adding', function() {
		var list = ["thing 1 todo", "thing 2 todo", "thing 3 todo"]
		
		var recordCount = list.length;
		
		list.forEach(function(value, _list) {
			AddToDoRecord(value);
		});
		
		expect(GetDisplayedItemsLeft(recordCount).getText()).toEqual(recordCount + " items left");
		
		list.forEach(function(value, _list) {
			MarkToDoAsDone(value);
		});
		
		expect(GetDisplayedItemsLeft(recordCount - recordCount).getText()).toEqual((recordCount - recordCount) + " items left");
	});
	
	it('clears completed todos after being done', function() {
		var list = ["thing to be completed one", "thing to be completed two", "thing to be completed three"]
		
		var recordCount = list.length;
		
		list.forEach(function(value, _list) {
			AddToDoRecord(value);
			MarkToDoAsDone(value);
		});
		
		ClearCompletedToDos();
		
		list.forEach(function(index, value, _list) {
			expect(RecordPresent(list[index])).toEqual(false);
		});
		
		expect(RecordPresent(GetDisplayedItemsLeft(recordCount))).toEqual(false);
	});
	
	it('edits a pre-existing todo in the list', function() {
		var toDoEntryToEdit = 'ToBeEdited';
		
		AddToDoRecord(toDoEntryToEdit);
		
		var EditText = EditToDo(toDoEntryToEdit);
		
		expect(RecordPresent(EditText)).toEqual(true);
	});
	
	it('checks all items to be marked as completed', function() {
		var list = ["Already done thing 1", "Already done thing 2", "Already done thing 3"];
		
		var count = list.length;
		
		list.forEach(function(value, _list) {
			AddToDoRecord(value);
		});
		
		MarkAllToDosAsDone();
		
		expect(GetDisplayedItemsLeft(0).getText()).toEqual((0) + " items left");
	})
});