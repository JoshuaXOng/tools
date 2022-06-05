use std::{env, io::{Result, Read}, fs::{File, write}, collections::{HashMap}};
use walkdir::{WalkDir};
use clap::Parser;
use regex::Regex;
use colored::Colorize;

#[derive(Parser)]
struct Args {
	#[clap(short)]
	front_wrapper: String,
	#[clap(short)]
	end_wrapper: String,
	#[clap(short)]
	code_matcher: String,
	#[clap(short)]
	regex_filter: Option<String>
}

fn main() -> Result<()> {
	let args = Args::parse();

	let root_dir = env::current_dir()?;

	match root_dir.to_str() {
		Some(root_dir) => println!("Root Directory: {} \n", root_dir),
		_ => println!("Root Directory: {} \n", "Can't Print - Probs Not UTF-8".italic())
	}

	let regex_filter = args.regex_filter.as_ref().and_then(|regex_filter| { 
		Regex::new(regex_filter.as_str()).ok() 
	});

	for entry in WalkDir::new(root_dir) {
		let metadata = entry.as_ref().map_err(|error| {
			println!("Failed to walk entry: \n{}", error)
		}).and_then(|entry| {
			entry.metadata().map_err(|error| {
				println!("Entry does not exist or privileges block usage: {}", error)
			})
		}).ok();
		if metadata.is_some() && metadata.unwrap().is_dir() {
			continue;
		}
		let entry = entry.as_ref().unwrap();
		
		let file_str = entry.file_name().to_str();
		match (&regex_filter, file_str) {
			(Some(regex_filter), Some(file_str)) => { 
				if !regex_filter.is_match(file_str) { 
					continue 
				} else { 
					println!("Modifying {}", file_str) 
				} 
			},
			(Some(_), None) => { 
				println!("Entry filtering might have failed."); 
				continue 
			},
			(None, Some(file_str)) => { 
				println!("Modifying {}", file_str) 
			},
			(None, None) => { 
				println!("Modifying file...") 
			},
		}

		let file = File::open(entry.path());
		let mut file_contents = file.and_then(|mut file| {
			let mut file_contents = String::new();
			let _ = file.read_to_string(&mut file_contents);
			Ok(file_contents)
		});
		if let Err(error) = file_contents { 
			print!("Failed to open file: {}", &error); 
			continue 
		};
		let file_contents = file_contents.as_mut().unwrap();

		let mut file_new_contents = file_contents.clone();

		let mut target_indices: Vec<_> = file_contents.match_indices(&args.code_matcher).collect();
		target_indices.reverse();
		for (target_index, _) in target_indices {
			let mut bracket_counters = HashMap::from([("(", 0), (")", 0), ("[", 0), ("]", 0), ("{", 0), ("}", 0)]);

			let start_index = target_index;
			let mut end_index = None;

			for (inner_index, letter) in (&file_contents.as_str()[target_index..]).chars().enumerate() {
				#[allow(unused_parens)]
				if (
					(bracket_counters.get("(").unwrap() != &0 || 
					bracket_counters.get("[").unwrap() != &0 ||
					bracket_counters.get("{").unwrap() != &0) &&
					(bracket_counters.get("(") == bracket_counters.get(")") &&
					bracket_counters.get("[") == bracket_counters.get("]") &&
					bracket_counters.get("{") == bracket_counters.get("}"))
				) {
					end_index = Some(start_index + inner_index);
					break;
				}

				if letter == '(' { bracket_counters.insert("(", bracket_counters.get("(").unwrap() + 1); }
				if letter == '[' { bracket_counters.insert("[", bracket_counters.get("[").unwrap() + 1); }
				if letter == '{' { bracket_counters.insert("{", bracket_counters.get("{").unwrap() + 1); }
				if letter == ')' { bracket_counters.insert(")", bracket_counters.get(")").unwrap() + 1); }
				if letter == ']' { bracket_counters.insert("]", bracket_counters.get("]").unwrap() + 1); }
				if letter == '}' { bracket_counters.insert("}", bracket_counters.get("}").unwrap() + 1); }
			}

			file_new_contents.insert_str(end_index.unwrap(), args.end_wrapper.as_str());
			file_new_contents.insert_str(start_index, args.front_wrapper.as_str());
			if let Err(error) = write(String::from(entry.path().as_os_str().to_str().unwrap())+".tmp", &file_new_contents) {
				println!("Failed to write new file: \n{}", error);
			}
		}
	}

	Ok(())
}

#[cfg(test)]
mod tests {
	#[test]
	fn test_non_nested() {
		assert_eq!(3, 3);
	}
}
