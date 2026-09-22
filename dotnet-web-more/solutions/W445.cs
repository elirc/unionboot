// W445: Captured ILogger assertions / Structured Trace event 104
namespace DotnetWeb;
public static class W445{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Trace,new EventId(104,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
