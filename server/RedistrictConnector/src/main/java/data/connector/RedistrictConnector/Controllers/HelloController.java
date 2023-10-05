package data.connector.RedistrictConnector.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/test")
public class HelloController {

	@GetMapping("")
	public String defaultMessage() {
		return "Default";
	}

	@GetMapping("/")
	public String helloMessage() {
		return "Hello! Response from endpoint #1.";
	}

	@GetMapping("/{name}")
	public String helloNameMessage(@PathVariable String name){
		return "Hello, " + name + "! Response from endpoint #2.";
	}

	@GetMapping("/g")
	public String goodbyeMessage() {
		return "---------Goodbye------------";
	}

	@GetMapping("/list")
	public ResponseEntity<List<String>> getList() {
		List<String> x = new ArrayList<String>();
		x.add("Hello");
		x.add("World");
		x.add("List");
		return ResponseEntity.ok(x);
	}

	@GetMapping("/hash")
	public HashMap<String, Object> getHash() {
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("Hello", "World");
		map.put("This", 1.01);
		map.put("Hash", 1);
		return map;
	}

	//Set up parameter test methods
}
