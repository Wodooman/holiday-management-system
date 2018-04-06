using log4net;
using log4net.Config;
using System.IO;
using System.Reflection;
using System.Xml;

namespace UserManagement.General.Logging
{
    /// <summary>
    /// Logging helper.
    /// </summary>
    public static class Log
    {
        static Log()
        {
            XmlDocument log4netConfig = new XmlDocument();
            log4netConfig.Load(File.OpenRead("log4net.config"));
            var repo = LogManager.CreateRepository(Assembly.GetEntryAssembly(), typeof(log4net.Repository.Hierarchy.Hierarchy));
            XmlConfigurator.Configure(repo, log4netConfig["log4net"]);
        }

        /// <summary>
        /// Returns Logger for specified object.
        /// </summary>
        /// <param name="obj">Object to log.</param>
        /// <returns>Instance of Logger.</returns>
        public static ILog For(object obj)
        {
            if (obj != null)
            {
                return LogManager.GetLogger(obj.GetType());
            }
            else
            {
                return LogManager.GetLogger(null);
            }
        }
    }
}
