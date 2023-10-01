package data.connector.RedistrictConnector.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/test")
public class HelloController {

	@GetMapping("")
	public String defaultMessage() {
		return "---------Default------------";
	}

	@GetMapping("/")
	public String helloMessage() {
		return "---------Hello------------";
	}

	@GetMapping("/g")
	public String goodbyeMessage() {
		return "---------Goodbye------------";
	}

	@GetMapping("/list")
	public List<String> getList() {
		List<String> x = new ArrayList<String>();
		x.add("Hello");
		x.add("World");
		x.add("Null");
		return x;
	}
}
